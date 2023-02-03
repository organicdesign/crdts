import { createGSet } from "../src/GSet.js";
import { createGSetTest } from "../../crdt-tests/src/g-set.js";

createGSetTest(createGSet);
