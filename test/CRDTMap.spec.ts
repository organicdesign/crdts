import { createCRDTMap } from "../src/CRDTMap.js";
import { createCRDTMapTest } from "crdt-tests";

createCRDTMapTest((id: Uint8Array) => createCRDTMap({ id }));
