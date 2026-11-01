const development = import.meta.env.DEV;
const developmentAdmin = development && import.meta.env.VITE_DEV_ROLE === "admin";
const fixturesEnabled = development && (
  import.meta.env.VITE_USE_FIXTURES === "true"
  || import.meta.env.VITE_USE_TEST_MATERIALS === "true"
  || developmentAdmin
);
const testMaterialsEnabled = development && import.meta.env.VITE_USE_TEST_MATERIALS === "true";
let memoryFixtures;

export async function getDevelopmentFixtures() {
  if (!fixturesEnabled && !testMaterialsEnabled) {
    return null;
  }

  if (memoryFixtures) return memoryFixtures;

  const [baseFixtures, testFixtures] = await Promise.all([
    fixturesEnabled ? import("../dev/fixtures.js") : Promise.resolve(null),
    testMaterialsEnabled ? import("../dev/test-fixtures.js") : Promise.resolve(null),
  ]);
  const fixtures = baseFixtures?.fixtures;

  memoryFixtures = {
    courses: fixtures?.courses ?? [],
    schedules: fixtures?.schedules ?? [],
    tasks: fixtures?.tasks ?? [],
    materials: [...(fixtures?.materials ?? []), ...(testFixtures?.testMaterials ?? [])],
    scheduleChanges: [],
  };
  return memoryFixtures;
}

export async function updateDevelopmentFixtures(updater) {
  const fixtures = await getDevelopmentFixtures();
  if (!fixtures) throw new Error("Perubahan hanya tersedia pada adapter development.");
  memoryFixtures = updater(fixtures);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("tumpukan:admin-data-change"));
  }
  return memoryFixtures;
}
