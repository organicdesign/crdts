import { createLWWMap } from "../src/LWWMap.js";
import createClock from "./logical-clock.js";
import { createLWWMapTest } from "../../crdt-tests/src/lww-map.js";

const generateTimestamp = createClock();

createLWWMapTest(({ id }: { id: Uint8Array }) => createLWWMap({ id, generateTimestamp }));
