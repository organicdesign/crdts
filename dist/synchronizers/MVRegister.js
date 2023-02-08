import * as cborg from "cborg";
export class MVRegisterSynchronizer {
    constructor(components, options = {}) {
        var _a;
        this.protocol = (_a = options.protocol) !== null && _a !== void 0 ? _a : "/mv-register/cbor/0.1.0";
        this.components = components;
    }
    sync(data) {
        if (data == null) {
            return cborg.encode(this.components.get());
        }
        const { values, logical } = cborg.decode(data);
        this.components.set(values, logical);
    }
}
export const createMVRegisterSynchronizer = (options) => (components) => new MVRegisterSynchronizer(components, options);
