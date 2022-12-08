import { createGCounter, deserializeGCounter } from "../src/GCounter.js";
import { createGCounterTest } from "crdt-tests";

createGCounterTest((id: string) => createGCounter({ id }), deserializeGCounter);
