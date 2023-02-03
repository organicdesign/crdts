import { createMVRegister } from "../src/MVRegister.js";
import { createMVRegisterTest } from "../../crdt-tests/src/mv-register.js";

createMVRegisterTest(createMVRegister);
