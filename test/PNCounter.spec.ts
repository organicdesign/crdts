import { createPNCounter } from "../src/PNCounter.js";
import createTests from "./pn-counter.js";

createTests((id:string) => createPNCounter({ id }));
