import * as cborg from "cborg";
export class GCounterBroadcaster {
    constructor(components, options = {}) {
        var _a, _b;
        this.broadcast = () => { };
        this.config = {
            protocol: (_a = options.protocol) !== null && _a !== void 0 ? _a : "/g-counter/cbor/0.1.0",
            listenOnly: (_b = options.listenOnly) !== null && _b !== void 0 ? _b : false
        };
        this.components = components;
        this.components.onChange((peer, count) => this.onChange(peer, count));
    }
    get protocol() {
        return this.config.protocol;
    }
    onBroadcast(data) {
        const { peer, count } = cborg.decode(data);
        this.components.set(peer, count);
    }
    setBroadcast(broadcast) {
        this.broadcast = broadcast;
    }
    onChange(peer, count) {
        const data = cborg.encode({ peer, count });
        if (!this.config.listenOnly) {
            this.broadcast(data);
        }
    }
}
export const createGCounterBroadcaster = (options) => (components) => new GCounterBroadcaster(components, options);
