import { main } from "../comparison/batch.ts";

main().catch((error) => { console.error(error); process.exitCode = 1; });
