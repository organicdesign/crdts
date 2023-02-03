import { createCRDTMap } from "../src/CRDTMap.js";
import { createCRDTMapTest } from "../../crdt-tests/src/crdt-map.js";

createCRDTMapTest(createCRDTMap);
