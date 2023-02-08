import * as cborg from "cborg";
export class GSetBroadcaster {
    constructor(components, options = {}) {
        var _a, _b;
        this.broadcast = () => { };
        this.config = {
            protocol: (_a = options.protocol) !== null && _a !== void 0 ? _a : "/g-set/cbor/0.1.0",
            listenOnly: (_b = options.listenOnly) !== null && _b !== void 0 ? _b : false
        };
        this.components = components;
        this.components.onChange((item) => this.onChange(item));
    }
    get protocol() {
        return this.config.protocol;
    }
    onBroadcast(data) {
        const item = cborg.decode(data);
        this.components.add(item);
    }
    setBroadcast(broadcast) {
        this.broadcast = broadcast;
    }
    onChange(item) {
        const data = cborg.encode(item);
        if (!this.config.listenOnly) {
            this.broadcast(data);
        }
    }
}
export const createGSetBroadcaster = (options) => (components) => new GSetBroadcaster(components, options);
