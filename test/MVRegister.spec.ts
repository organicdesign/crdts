import { createMVRegister } from "../src/MVRegister.js";
import { createMVRegisterTest } from "@organicdesign/crdt-tests";


createMVRegisterTest(createMVRegister);
