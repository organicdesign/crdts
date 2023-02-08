import * as cborg from "cborg";
export class GSetSynchronizer {
    constructor(components, options = {}) {
        var _a;
        this.protocol = (_a = options.protocol) !== null && _a !== void 0 ? _a : "/g-set/cbor/0.1.0";
        this.components = components;
    }
    sync(data) {
        if (data == null) {
            return cborg.encode([...this.components.get()]);
        }
        const items = cborg.decode(data);
        for (const item of items) {
            this.components.add(item);
        }
    }
}
export const createGSetSynchronizer = (options) => (components) => new GSetSynchronizer(components, options);
