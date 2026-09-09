import { main } from "../comparison/compare.tsx";

const TIMEOUT_MS = 120_000;
const timeout = setTimeout(() => {
  console.error(`\nTimed out after ${TIMEOUT_MS / 1000}s`);
  process.exit(2);
}, TIMEOUT_MS);

main()
  .then(() => {
    clearTimeout(timeout);
    process.exit(0);
  })
  .catch((err) => {
    clearTimeout(timeout);
    console.error("Error:", err);
    process.exit(1);
  });
