export type UploadProgress = {
  loaded: number;
  total: number;
  percent: number;
};

export function putWithProgress(
  url: string,
  file: File,
  onProgress?: (p: UploadProgress) => void,
  extraHeaders?: Record<string, string>
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.setRequestHeader("x-amz-acl", "public-read");
    xhr.setRequestHeader("x-amz-meta-access-control-allow-origin", "*");
    if (extraHeaders) {
      Object.entries(extraHeaders).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    }

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const percent = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
      onProgress?.({ loaded: e.loaded, total: e.total, percent });
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(file);
  });
}

