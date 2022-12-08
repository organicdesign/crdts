import { createGSet } from "../src/GSet.js";
import { createGSetTest } from "crdt-tests";

createGSetTest((id: string) => createGSet({ id }));
