import * as cborg from "cborg";
export class LWWRegisterSynchronizer {
    constructor(components, options = {}) {
        var _a;
        this.protocol = (_a = options.protocol) !== null && _a !== void 0 ? _a : "/lww-register/cbor/0.1.0";
        this.components = components;
    }
    sync(data, { id }) {
        if (data == null) {
            const localValue = this.components.get();
            return cborg.encode({
                value: localValue.value,
                physical: localValue.physical,
                logical: localValue.logical
            });
        }
        const { value, physical, logical } = cborg.decode(data);
        this.components.set(value, physical, logical, id);
    }
}
export const createLWWRegisterSynchronizer = (options) => (components) => new LWWRegisterSynchronizer(components, options);
