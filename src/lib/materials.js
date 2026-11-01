export function isPdfMaterial(material) {
  return material?.mimeType === "application/pdf" || /\.pdf$/i.test(material?.fileName ?? "");
}
