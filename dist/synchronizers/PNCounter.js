import { getSynchronizer } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";
export class PNCounterSynchronizer {
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
    sync(data, context) {
        var _a, _b, _c, _d;
        if (data == null) {
            const pData = (_a = getSynchronizer(this.components.getPCounter(), this.options.subProtocol)) === null || _a === void 0 ? void 0 : _a.sync(undefined, context);
            const nData = (_b = getSynchronizer(this.components.getNCounter(), this.options.subProtocol)) === null || _b === void 0 ? void 0 : _b.sync(undefined, context);
            const syncObj = {};
            if (pData != null) {
                syncObj.pData = pData;
            }
            if (nData != null) {
                syncObj.nData = nData;
            }
            return cborg.encode(syncObj);
        }
        const { pData, nData } = cborg.decode(data);
        const syncObj = {};
        if (pData != null) {
            syncObj.pData = (_c = getSynchronizer(this.components.getPCounter(), this.options.subProtocol)) === null || _c === void 0 ? void 0 : _c.sync(pData, context);
        }
        if (nData != null) {
            syncObj.nData = (_d = getSynchronizer(this.components.getNCounter(), this.options.subProtocol)) === null || _d === void 0 ? void 0 : _d.sync(nData, context);
        }
        if (pData == null && nData == null) {
            return;
        }
        return cborg.encode(syncObj);
    }
}
export const createPNCounterSynchronizer = (options) => (components) => new PNCounterSynchronizer(components, options);
