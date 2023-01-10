import { createPNCounter } from "../src/PNCounter.js";
import { createPNCounterTest } from "crdt-tests";

createPNCounterTest(createPNCounter);
