import * as cborg from "cborg";
export class GCounterSerializer {
    constructor(components, options = {}) {
        var _a;
        this.protocol = (_a = options.protocol) !== null && _a !== void 0 ? _a : "/g-counter/cbor/0.1.0";
        this.components = components;
    }
    serialize() {
        const data = [];
        const peers = this.components.getPeers();
        for (const id of peers) {
            data.push({ id, count: this.components.get(id) });
        }
        return cborg.encode(data);
    }
    deserialize(data) {
        const decoded = cborg.decode(data);
        for (const { id, count } of decoded) {
            this.components.set(id, count);
        }
    }
}
export const createGCounterSerializer = (options) => (components) => new GCounterSerializer(components, options);
