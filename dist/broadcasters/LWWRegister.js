import * as cborg from "cborg";
export class LWWRegisterBroadcaster {
    constructor(components, options = {}) {
        var _a, _b;
        this.broadcast = () => { };
        this.config = {
            protocol: (_a = options.protocol) !== null && _a !== void 0 ? _a : "/lww-register/cbor/0.1.0",
            listenOnly: (_b = options.listenOnly) !== null && _b !== void 0 ? _b : false
        };
        this.components = components;
        this.components.onChange((value, physical, logical, id) => this.onChange(value, physical, logical, id));
    }
    get protocol() {
        return this.config.protocol;
    }
    onBroadcast(data) {
        const { value, physical, logical, id } = cborg.decode(data);
        this.components.set(value, physical, logical, id);
    }
    setBroadcast(broadcast) {
        this.broadcast = broadcast;
    }
    onChange(value, physical, logical, id) {
        const data = cborg.encode({ value, physical, logical, id });
        if (!this.config.listenOnly) {
            this.broadcast(data);
        }
    }
}
export const createLWWRegisterBroadcaster = (options) => (components) => new LWWRegisterBroadcaster(components, options);
