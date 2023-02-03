import { createPNCounter } from "../src/PNCounter.js";
import { createPNCounterTest } from "../../crdt-tests/src/pn-counter.js";

createPNCounterTest(createPNCounter);
