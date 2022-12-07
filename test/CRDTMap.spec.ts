import { createCRDTMap } from "../src/CRDTMap.js";
import createTests from "./crdt-map.js";


createTests((id: string) => createCRDTMap({ id }));
