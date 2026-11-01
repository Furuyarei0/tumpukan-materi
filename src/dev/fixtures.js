const courses = [
  { id: "interaksi-manusia-komputer", name: "Interaksi Manusia dan Komputer", lecturer: "Yolanda, M.Kom", credits: 3, color: "sage" },
  { id: "struktur-data-algoritma", name: "Struktur Data dan Algoritma", lecturer: "Andreo Yudherta, M.Eng", credits: 4, color: "mustard" },
  { id: "islamic-peradaban-melayu", name: "Islamic Peradaban Melayu", lecturer: "Dr. Benny Agusti Putra, S.Hum., MA", credits: 2, color: "terracotta" },
  { id: "pemrograman-web-2", name: "Pemrograman Web 2", lecturer: "Lailyn Puad, S.Kom., M.Kom", credits: 4, color: "blue" },
  { id: "jaringan-komunikasi-data", name: "Jaringan dan Komunikasi Data", lecturer: "Bastomi Baharsyah, M.Kom", credits: 3, color: "sage" },
  { id: "islamic-enterpreneurship", name: "Islamic Enterpreneurship", lecturer: "Al Amin, S.I.Kom., M.I.Kom", credits: 2, color: "mustard" },
  { id: "perencanaan-strategi-si", name: "Perencanaan dan Strategi Sistem Informasi", lecturer: "M. Yusuf, M.Si", credits: 3, color: "terracotta" },
  { id: "bahasa-inggris", name: "Bahasa Inggris", lecturer: "Hendri Kurniadi, M.Pd", credits: 2, color: "blue" },
];

const schedules = [
  { id: "schedule-1", courseId: courses[0].id, dayOfWeek: 1, startTime: "07:30", endTime: "09:10", room: "A-602" },
  { id: "schedule-2", courseId: courses[1].id, dayOfWeek: 1, startTime: "09:20", endTime: "12:40", room: "A-602" },
  { id: "schedule-3", courseId: courses[2].id, dayOfWeek: 2, startTime: "07:30", endTime: "09:10", room: "A-602" },
  { id: "schedule-4", courseId: courses[3].id, dayOfWeek: 2, startTime: "09:20", endTime: "12:40", room: "A-602" },
  { id: "schedule-5", courseId: courses[4].id, dayOfWeek: 3, startTime: "07:30", endTime: "10:00", room: "A-602" },
  { id: "schedule-6", courseId: courses[5].id, dayOfWeek: 3, startTime: "10:10", endTime: "11:50", room: "A-602" },
  { id: "schedule-7", courseId: courses[6].id, dayOfWeek: 4, startTime: "10:10", endTime: "11:50", room: "A-602" },
  { id: "schedule-8", courseId: courses[7].id, dayOfWeek: 4, startTime: "13:00", endTime: "14:40", room: "A-602" },
];

export const fixtures = {
  courses,
  schedules,
  tasks: [],
  materials: [],
};
