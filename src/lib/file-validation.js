import {
  ALLOWED_UPLOAD_MIME_TYPES,
  ALLOWED_UPLOAD_EXTENSIONS,
  MAX_UPLOAD_SIZE_BYTES,
} from "./config.js";

const MIME_TYPES_BY_EXTENSION = {
  ".pdf": ["application/pdf"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".webp": ["image/webp"],
  ".zip": ["application/zip", "application/x-zip-compressed"],
};

export function validateMaterialFile(file) {
  if (!file) return "Pilih file yang ingin dikirim.";
  if (file.size > MAX_UPLOAD_SIZE_BYTES) return "Ukuran file maksimal 20 MB.";

  const extension = `.${file.name.split(".").pop().toLowerCase()}`;
  if (!ALLOWED_UPLOAD_EXTENSIONS.includes(extension)) {
    return "Format yang didukung: PDF, DOCX, PPTX, XLSX, JPG, PNG, WebP, dan ZIP.";
  }

  const acceptedMimeTypes = MIME_TYPES_BY_EXTENSION[extension];
  const mimeType = file.type.toLowerCase();
  const zipMimeType = extension === ".zip" && mimeType === "application/x-zip-compressed";
  if (
    mimeType
    && (!ALLOWED_UPLOAD_MIME_TYPES.includes(mimeType) && !zipMimeType
      || !acceptedMimeTypes.includes(mimeType))
  ) {
    return "Jenis file tidak cocok dengan ekstensi nama file.";
  }

  return null;
}

export function getMaterialMimeType(file) {
  const extension = `.${file.name.split(".").pop().toLowerCase()}`;
  return file.type || MIME_TYPES_BY_EXTENSION[extension]?.[0] || "application/octet-stream";
}
