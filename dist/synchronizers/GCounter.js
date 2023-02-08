import * as cborg from "cborg";
export class GCounterSynchronizer {
    constructor(components, options = {}) {
        var _a;
        this.protocol = (_a = options.protocol) !== null && _a !== void 0 ? _a : "/g-counter/cbor/0.1.0";
        this.components = components;
    }
    sync(data) {
        if (data == null) {
            const response = [];
            for (const peer of this.components.getPeers()) {
                response.push({
                    id: peer,
                    count: this.components.get(peer)
                });
            }
            return cborg.encode(response);
        }
        const counts = cborg.decode(data);
        for (const iCount of counts) {
            const { id, count } = iCount;
            if (count != null) {
                this.components.set(id, count);
            }
        }
    }
}
export const createGCounterSynchronizer = (options) => (components) => new GCounterSynchronizer(components, options);
