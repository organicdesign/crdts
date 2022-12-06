import { createGSet } from "../src/GSet.js";
import createGSetTests from "./g-set.js";


createGSetTests((id:string) => createGSet({ id }));
