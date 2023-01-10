import { createGCounter } from "../src/GCounter.js";
import { createGCounterTest } from "crdt-tests";

createGCounterTest(createGCounter);
