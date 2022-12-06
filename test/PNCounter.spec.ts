import { createPNCounter } from "../src/PNCounter.js";
import createPNCoutnerTests from "./pn-counter.js";

createPNCoutnerTests((id:string) => createPNCounter({ id }));
