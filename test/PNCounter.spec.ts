import { createPNCounter } from "../src/PNCounter.js";
import { createPNCounterTest } from "crdt-tests";

createPNCounterTest((id: string) => createPNCounter({ id }));
