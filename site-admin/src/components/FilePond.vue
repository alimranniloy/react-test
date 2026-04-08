<template>
  <file-pond
    :name="'test'"
    :ref="'pond'"
    :allow-multiple="allowMultiple"
    :allowReplace="allowReplace"
    :accepted-file-types="accepted"
    :files="files"
    :storeAsFile="true"
    :credits="[{ label: '', url: '' }]"
    v-on:addfile="handleFileAdd"
    v-on:removefile="handleFileRemove"
  />
</template>
<script setup>
import JsBarcode from "jsbarcode";
import { computed, ref, defineAsyncComponent } from "vue";
import QRCode from "qrcode";
// Import Vue FilePond
import vueFilePond from "vue-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import imageCompression from "browser-image-compression";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
const emit = defineEmits(["onAdded", "onRemove"]);
// Create FilePond component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

const props = defineProps({
  files: {
    type: Array,
    required: false,
  },
  allowMultiple: {
    type: Boolean,
    required: false,
    default: false,
  },
  allowReplace: {
    type: Boolean,
    required: false,
    default: true,
  },
  code: {
    type: String,
    required: false,
    default: "bponi.com",
  },
  isQr: {
    type: Boolean,
    required: false,
    default: false,
  },
  isBarcode: {
    type: Boolean,
    required: false,
    default: false,
  },
  accepted: {
    type: String,
    required: false,
    default: "image/*",
  },
});

const handleFileAdd = async (error, file) => {
  if (!error) {
    
    const fileName = file.file.name;
    if (props.isQr) {
      const image = new Image();
      image.src = URL.createObjectURL(file.file);
      const qrCodeText = props.code;
      const qrCodeSize = 50; // Size of the QR code
      // Generate the QR code as a data URL
      const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText, {
        width: qrCodeSize,
        margin: 1,
      });
      // Wait for the image to load
      image.onload = async (f) => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        // Draw the original image on the canvas
        context.drawImage(image, 0, 0);
        const qrCodeImage = new Image();
        qrCodeImage.src = qrCodeDataUrl;
        // Wait for the QR code image to load
        qrCodeImage.onload = () => {
          // Draw the QR code on the image
          context.drawImage(
            qrCodeImage,
            image.width - qrCodeSize - 0, // X-coordinate
            image.height - qrCodeSize - 0, // Y-coordinate
            qrCodeSize,
            qrCodeSize
          );
          // Set the final image as the data URL of the modified image
          const dataURL = canvas.toDataURL("image/jpeg");
          const base64Data = dataURL.split(",")[1];
          const binaryData =window.atob(base64Data);
          const dataArray = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            dataArray[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([dataArray], { type: "image/jpeg" });
          const file = new File([blob], fileName, { type: "image/jpeg" });
          handleImageUpload(file);
        };
      };
    } else if (props.isBarcode) {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, props.code, {
        format: "CODE128", // Barcode format, you can change it as per your requirement
        //displayValue: false, // Do not display the value below the barcode
        fontSize: 10,
        height: 15,
        width: 2,
        font: "system-ui",
        margin: 2,
        textAlign: "right",
      });

      const barcodeImage = new Image();
      barcodeImage.src = canvas.toDataURL();

      const image = new Image();
      image.src = URL.createObjectURL(file.file);

      // Wait for both images to load
      Promise.all([loadImage(image), loadImage(barcodeImage)]).then(() => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        context.drawImage(
          barcodeImage,
          image.width - barcodeImage.width - 10,
          image.height - barcodeImage.height - 10
        );

        // Set the final image as the data URL of the modified image
        canvas.toBlob((blob) => {
          const file = new File([blob], fileName, { type: "image/jpeg" });
          handleImageUpload(file);
        }, "image/jpeg");
      });

      // Function to load an image and return a Promise
      function loadImage(image) {
        return new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
        });
      }
    } else {
      handleImageUpload(file.file);
    }
  }
};
const handleImageUpload = async (file) => {
  const options = {
    maxSizeMB: 0.512,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };
  try {
    if (file.type != 'image/webp') {
      const compressedFile = await imageCompression(file, options);
      console.log(`optimized size ${compressedFile.size / 1024} KB`); // smaller than maxSizeMB
      emit("onAdded", compressedFile);
    } else {
      console.log(`not optimized`); // 
      emit("onAdded", file);
    }
  } catch (error) {
    console.log(error);
    emit("onAdded", file);
  }
};
const handleFileRemove = (error, file) => {
  if (!error) {
    emit("onRemove", file.file);
  }
};
</script>
