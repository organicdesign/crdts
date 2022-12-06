import { createLWWRegister } from "../src/LWWRegister.js";
import createClock from "./logical-clock.js";
import createTests from "./lww-register.js";

const generateTimestamp = createClock();

createTests((id: string) => createLWWRegister({ id, generateTimestamp }));
