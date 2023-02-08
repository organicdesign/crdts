import { createGSet } from "../src/GSet.js";
import { createGSetTest } from "@organicdesign/crdt-tests";

createGSetTest(createGSet);
