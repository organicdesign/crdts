import { createPNCounter } from "../src/PNCounter.js";
import { createPNCounterTest } from "@organicdesign/crdt-tests";

createPNCounterTest(createPNCounter);
