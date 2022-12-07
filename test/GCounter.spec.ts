import { createGCounter, deserializeGCounter } from "../src/GCounter.js";
import createTests from "./g-counter.js";

createTests((id: string) => createGCounter({ id }), deserializeGCounter);
