function createTestPdfUrl() {
  const content = "BT /F1 22 Tf 58 738 Td (Bahan kuliah [UJI]) Tj ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let document = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(document.length);
    document += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const crossReferenceOffset = document.length;
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  document += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  document += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${crossReferenceOffset}\n%%EOF`;
  return `data:application/pdf;base64,${btoa(document)}`;
}

const courses = [
  "interaksi-manusia-komputer",
  "struktur-data-algoritma",
];

export const testMaterials = [
  {
    id: "uji-pdf-interaksi-manusia",
    courseId: courses[0],
    title: "[UJI] Ringkasan Interaksi Manusia",
    fileName: "uji-ringkasan.pdf",
    mimeType: "application/pdf",
    fileSize: 1024,
    status: "approved",
    url: createTestPdfUrl(),
  },
  {
    id: "uji-presentasi-struktur-data",
    courseId: courses[1],
    title: "[UJI] Materi presentasi struktur data",
    fileName: "uji-presentasi.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    fileSize: 22,
    status: "approved",
    url: "data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==",
  },
  {
    id: "uji-pending-tidak-tampil",
    courseId: courses[0],
    title: "[UJI] Kiriman pending tidak boleh tampil",
    fileName: "uji-pending.pdf",
    mimeType: "application/pdf",
    fileSize: 1024,
    status: "pending",
    url: createTestPdfUrl(),
  },
];
