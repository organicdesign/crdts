import { getBroadcaster } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";
export class PNCounterBroadcaster {
    constructor(components, options = {}) {
        var _a, _b, _c, _d, _e;
        this.broadcast = () => { };
        this.options = {
            protocol: (_a = options.protocol) !== null && _a !== void 0 ? _a : "/pn-counter/cbor/0.1.0",
            subProtocol: (_b = options.subProtocol) !== null && _b !== void 0 ? _b : "/g-counter/cbor/0.1.0",
            listenOnly: (_c = options.listenOnly) !== null && _c !== void 0 ? _c : false
        };
        this.components = components;
        (_d = getBroadcaster(this.components.getPCounter(), this.options.subProtocol)) === null || _d === void 0 ? void 0 : _d.setBroadcast((data) => this.onSubBroadcast(data, "P"));
        (_e = getBroadcaster(this.components.getNCounter(), this.options.subProtocol)) === null || _e === void 0 ? void 0 : _e.setBroadcast((data) => this.onSubBroadcast(data, "N"));
    }
    get protocol() {
        return this.options.protocol;
    }
    onBroadcast(data) {
        var _a, _b;
        const { subData, type } = cborg.decode(data);
        if (type === "P") {
            (_a = getBroadcaster(this.components.getPCounter(), this.options.subProtocol)) === null || _a === void 0 ? void 0 : _a.onBroadcast(subData);
        }
        if (type === "N") {
            (_b = getBroadcaster(this.components.getNCounter(), this.options.subProtocol)) === null || _b === void 0 ? void 0 : _b.onBroadcast(subData);
        }
    }
    setBroadcast(broadcast) {
        this.broadcast = broadcast;
    }
    onSubBroadcast(data, type) {
        if (!this.options.listenOnly) {
            this.broadcast(cborg.encode({ subData: data, type }));
        }
    }
}
export const createPNCounterBroadcaster = (options) => (components) => new PNCounterBroadcaster(components, options);
