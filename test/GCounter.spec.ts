import { createGCounter, deserializeGCounter } from "../src/GCounter.js";
import createGCoutnerTests from "./g-counter.js";

createGCoutnerTests((id:string) => createGCounter({ id }), deserializeGCounter);
