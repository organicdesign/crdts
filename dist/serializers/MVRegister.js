import * as cborg from "cborg";
export class MVRegisterSerializer {
    constructor(components, options = {}) {
        var _a;
        this.protocol = (_a = options.protocol) !== null && _a !== void 0 ? _a : "/mv-register/cbor/0.1.0";
        this.components = components;
    }
    serialize() {
        return cborg.encode(this.components.get());
    }
    deserialize(data) {
        const { values, logical } = cborg.decode(data);
        this.components.set(values, logical);
    }
}
export const createMVRegisterSerializer = (options) => (components) => new MVRegisterSerializer(components, options);
