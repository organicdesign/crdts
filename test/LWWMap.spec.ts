import { createLWWMap } from "../src/LWWMap.js";
import createClock from "./logical-clock.js";
import { createLWWMapTest } from "crdt-tests";

const generateTimestamp = createClock();

createLWWMapTest((id: string) => createLWWMap({ id, generateTimestamp }));
