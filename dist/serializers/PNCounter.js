import { getSerializer } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";
export class PNCounterSerializer {
    constructor(components, options = {}) {
        var _a, _b;
        this.options = {
            protocol: (_a = options.protocol) !== null && _a !== void 0 ? _a : "/pn-counter/cbor/0.1.0",
            subProtocol: (_b = options.subProtocol) !== null && _b !== void 0 ? _b : "/g-counter/cbor/0.1.0"
        };
        this.components = components;
    }
    get protocol() {
        return this.options.protocol;
    }
    serialize() {
        var _a, _b;
        return cborg.encode({
            pData: (_a = getSerializer(this.components.getPCounter(), this.options.subProtocol)) === null || _a === void 0 ? void 0 : _a.serialize(),
            nData: (_b = getSerializer(this.components.getNCounter(), this.options.subProtocol)) === null || _b === void 0 ? void 0 : _b.serialize()
        });
    }
    deserialize(data) {
        var _a, _b;
        const { pData, nData } = cborg.decode(data);
        (_a = getSerializer(this.components.getPCounter(), this.options.subProtocol)) === null || _a === void 0 ? void 0 : _a.deserialize(pData);
        (_b = getSerializer(this.components.getNCounter(), this.options.subProtocol)) === null || _b === void 0 ? void 0 : _b.deserialize(nData);
    }
}
export const createPNCounterSerializer = (options) => (components) => new PNCounterSerializer(components, options);
