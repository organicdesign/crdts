import { createCRDTMap } from "../src/CRDTMap.js";
import { createCRDTMapTest } from "crdt-tests";

createCRDTMapTest((id: string) => createCRDTMap({ id }));
