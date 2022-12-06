import { createGSet } from "../src/GSet.js";
import createTests from "./g-set.js";


createTests((id:string) => createGSet({ id }));
