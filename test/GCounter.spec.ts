import { createGCounter } from "../src/GCounter.js";
import { createGCounterTest } from "@organicdesign/crdt-tests";

createGCounterTest(createGCounter);
