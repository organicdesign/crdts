import * as cborg from "cborg";
export class LWWRegisterSerializer {
    constructor(components, options = {}) {
        var _a;
        this.protocol = (_a = options.protocol) !== null && _a !== void 0 ? _a : "/lww-register/cbor/0.1.0";
        this.components = components;
    }
    serialize() {
        return cborg.encode(this.components.get());
    }
    deserialize(data) {
        const { value, physical, logical, id } = cborg.decode(data);
        this.components.set(value, physical, logical, id);
    }
}
export const createLWWRegisterSerializer = (options) => (components) => new LWWRegisterSerializer(components, options);
