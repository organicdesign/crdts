import { createGCounter } from "../src/GCounter.js";
import { createGCounterTest } from "../../crdt-tests/src/g-counter.js";

createGCounterTest(createGCounter);
