import { createCRDTMap } from "../src/CRDTMap.js";
import { createCRDTMapTest } from "@organicdesign/crdt-tests";

createCRDTMapTest(createCRDTMap);
