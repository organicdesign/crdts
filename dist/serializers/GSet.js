import * as cborg from "cborg";
export class GSetSerializer {
    constructor(components, options = {}) {
        var _a;
        this.protocol = (_a = options.protocol) !== null && _a !== void 0 ? _a : "/g-set/cbor/0.1.0";
        this.components = components;
    }
    serialize() {
        return cborg.encode([...this.components.get()]);
    }
    deserialize(data) {
        const items = cborg.decode(data);
        for (const item of items) {
            this.components.add(item);
        }
    }
}
export const createGSetSerializer = (options) => (components) => new GSetSerializer(components, options);
