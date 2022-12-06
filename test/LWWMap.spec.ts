import { createLWWMap } from "../src/LWWMap.js";
import createClock from "./logical-clock.js";
import createTests from "./lww-map.js";

const generateTimestamp = createClock();

createTests((id: string) => createLWWMap({ id, generateTimestamp }));
