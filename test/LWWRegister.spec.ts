import { createLWWRegister } from "../src/LWWRegister.js";
import createClock from "./logical-clock.js";
import { createLWWRegisterTest } from "crdt-tests";

const generateTimestamp = createClock();

createLWWRegisterTest((id: string) => createLWWRegister({ id, generateTimestamp }));
