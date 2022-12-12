import { createGCounter } from "../src/GCounter.js";
import { createGCounterTest } from "crdt-tests";

createGCounterTest((id: Uint8Array) => createGCounter({ id }));
