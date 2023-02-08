import { createLWWMap } from "../src/LWWMap.js";
import createClock from "./logical-clock.js";
import { createLWWMapTest } from "@organicdesign/crdt-tests";

const generateTimestamp = createClock();

createLWWMapTest(({ id }: { id: Uint8Array }) => createLWWMap({ id, generateTimestamp }));
