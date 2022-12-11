import { createGSet } from "../src/GSet.js";
import { createGSetTest } from "crdt-tests";

createGSetTest((id: Uint8Array) => createGSet({ id }));
