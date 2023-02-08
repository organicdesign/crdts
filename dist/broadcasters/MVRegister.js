import * as cborg from "cborg";
export class MVRegisterBroadcaster {
    constructor(components, options = {}) {
        var _a, _b;
        this.broadcast = () => { };
        this.config = {
            protocol: (_a = options.protocol) !== null && _a !== void 0 ? _a : "/mv-register/cbor/0.1.0",
            listenOnly: (_b = options.listenOnly) !== null && _b !== void 0 ? _b : false
        };
        this.components = components;
        this.components.onChange((values, logical) => this.onChange(values, logical));
    }
    get protocol() {
        return this.config.protocol;
    }
    onBroadcast(data) {
        const { values, logical } = cborg.decode(data);
        this.components.set(values, logical);
    }
    setBroadcast(broadcast) {
        this.broadcast = broadcast;
    }
    onChange(values, logical) {
        const data = cborg.encode({ values, logical });
        if (!this.config.listenOnly) {
            this.broadcast(data);
        }
    }
}
export const createMVRegisterBroadcaster = (options) => (components) => new MVRegisterBroadcaster(components, options);
