import { createLWWRegister } from "../src/LWWRegister.js";
import createClock from "./logical-clock.js";
import { createLWWRegisterTest } from "../../crdt-tests/src/lww-register.js";

const generateTimestamp = createClock();

createLWWRegisterTest(({ id }: { id: Uint8Array }) => createLWWRegister({ id, generateTimestamp }));
