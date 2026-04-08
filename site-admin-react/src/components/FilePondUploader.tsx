import { useEffect, useMemo, useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import imageCompression from "browser-image-compression";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

type FilePondUploaderProps = {
  files?: Array<File | { source: string }>;
  allowMultiple?: boolean;
  allowReplace?: boolean;
  accepted?: string | string[];
  code?: string;
  isQr?: boolean;
  isBarcode?: boolean;
  className?: string;
  disabled?: boolean;
  onAdded?: (file: File) => void;
  onRemove?: (file: File) => void;
};

export default function FilePondUploader({
  files,
  allowMultiple = false,
  allowReplace = true,
  accepted = "image/*",
  code = "bponi.com",
  isQr = false,
  isBarcode = false,
  className,
  disabled = false,
  onAdded,
  onRemove
}: FilePondUploaderProps) {
  const skipSignatureRef = useRef<string | null>(null);
  const initialFiles = useMemo(() => {
    if (!files?.length) return [];
    return files.map((file) =>
      typeof file === "string" || "source" in file
        ? { source: typeof file === "string" ? file : file.source, options: { type: "local" } }
        : file
    );
  }, [files]);

  const [pondFiles, setPondFiles] = useState<any[]>([]);

  useEffect(() => {
    setPondFiles(initialFiles as any[]);
  }, [initialFiles]);

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const handleImageUpload = async (file: File) => {
    const options = {
      maxSizeMB: 0.512,
      maxWidthOrHeight: 1200,
      useWebWorker: true
    };
    try {
      if (file.type !== "image/webp") {
        const compressedFile = await imageCompression(file, options);
        skipSignatureRef.current = `${compressedFile.name}-${compressedFile.size}-${compressedFile.lastModified}`;
        onAdded?.(compressedFile);
      } else {
        skipSignatureRef.current = `${file.name}-${file.size}-${file.lastModified}`;
        onAdded?.(file);
      }
    } catch (error) {
      skipSignatureRef.current = `${file.name}-${file.size}-${file.lastModified}`;
      onAdded?.(file);
    }
  };

  const handleFileAdd = async (file: File) => {
    if (isQr) {
      const original = await loadImage(URL.createObjectURL(file));
      const qrCodeDataUrl = await QRCode.toDataURL(code, { width: 50, margin: 1 });
      const qrImage = await loadImage(qrCodeDataUrl);

      const canvas = document.createElement("canvas");
      canvas.width = original.width;
      canvas.height = original.height;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(original, 0, 0);
      context.drawImage(qrImage, original.width - 50, original.height - 50, 50, 50);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const nextFile = new File([blob], file.name, { type: "image/jpeg" });
        handleImageUpload(nextFile);
      }, "image/jpeg");
      return;
    }

    if (isBarcode) {
      const barcodeCanvas = document.createElement("canvas");
      JsBarcode(barcodeCanvas, code, {
        format: "CODE128",
        fontSize: 10,
        height: 15,
        width: 2,
        font: "system-ui",
        margin: 2,
        textAlign: "right"
      });

      const original = await loadImage(URL.createObjectURL(file));
      const barcodeImage = await loadImage(barcodeCanvas.toDataURL());

      const canvas = document.createElement("canvas");
      canvas.width = original.width;
      canvas.height = original.height;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(original, 0, 0);
      context.drawImage(
        barcodeImage,
        original.width - barcodeImage.width - 10,
        original.height - barcodeImage.height - 10
      );

      canvas.toBlob((blob) => {
        if (!blob) return;
        const nextFile = new File([blob], file.name, { type: "image/jpeg" });
        handleImageUpload(nextFile);
      }, "image/jpeg");
      return;
    }

    handleImageUpload(file);
  };

  const server = useMemo(
    () => ({
      load: (
        source: string,
        load: (file: Blob) => void,
        error: (message: string) => void,
        progress: (isLengthComputable: boolean, loaded: number, total: number) => void,
        abort: () => void
      ) => {
        if (!source) {
          error("Missing file source");
          return { abort };
        }
        const controller = new AbortController();
        fetch(source, { signal: controller.signal })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch file: ${response.status}`);
            }
            const total = Number(response.headers.get("content-length") || 0);
            if (total) progress(true, 0, total);
            return response.blob();
          })
          .then((blob) => {
            progress(true, blob.size, blob.size);
            load(blob);
          })
          .catch((err) => {
            if (err.name === "AbortError") return;
            error("Could not load file");
          });
        return {
          abort: () => {
            controller.abort();
            abort();
          }
        };
      }
    }),
    []
  );

  return (
    <FilePond
      name="file"
      files={pondFiles}
      allowMultiple={allowMultiple}
      allowReplace={allowReplace}
      disabled={disabled}
      className={className}
      server={server}
      acceptedFileTypes={
        accepted
          ? Array.isArray(accepted)
            ? accepted
            : accepted.split(",").map((item) => item.trim())
          : undefined
      }
      storeAsFile
      credits={false}
      onupdatefiles={(items) => {
        setPondFiles(items);
      }}
      onaddfile={(_, file) => {
        // Only process user-added files; skip initial/remote/processed files to avoid loops.
        if (!file?.file || file.origin !== 1) return;
        const signature = `${file.file.name}-${file.file.size}-${file.file.lastModified}`;
        if (skipSignatureRef.current === signature) {
          skipSignatureRef.current = null;
          return;
        }
        if (file?.file && file.origin === 1) {
          handleFileAdd(file.file as File);
        }
      }}
      onremovefile={(_, file) => {
        if (file?.file && onRemove) onRemove(file.file as File);
      }}
    />
  );
}
