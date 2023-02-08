import { getSynchronizer } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";
export class LWWMapSynchronizer {
    constructor(components, options = {}) {
        var _a, _b;
        this.options = {
            protocol: (_a = options.protocol) !== null && _a !== void 0 ? _a : "/lww-map/cbor/0.1.0",
            subProtocol: (_b = options.subProtocol) !== null && _b !== void 0 ? _b : "/lww-register/cbor/0.1.0"
        };
        this.components = components;
    }
    get protocol() {
        return this.options.protocol;
    }
    sync(data, context) {
        var _a, _b;
        if (data == null) {
            const output = {};
            for (const key of this.components.keys()) {
                const value = this.components.get(key);
                if (value == null) {
                    continue;
                }
                const syncData = (_a = getSynchronizer(value, this.options.subProtocol)) === null || _a === void 0 ? void 0 : _a.sync(undefined, context);
                if (syncData != null) {
                    output[key] = syncData;
                }
            }
            return cborg.encode(output);
        }
        const syncData = cborg.decode(data);
        const syncObj = {};
        for (const key of Object.keys(syncData)) {
            const value = this.components.get(key);
            if (value == null) {
                continue;
            }
            const newSyncData = (_b = getSynchronizer(value, this.options.subProtocol)) === null || _b === void 0 ? void 0 : _b.sync(syncData[key], context);
            if (newSyncData != null) {
                syncObj[key] = newSyncData;
            }
        }
        if (Object.keys(syncObj).length === 0) {
            return;
        }
        return cborg.encode(syncObj);
    }
}
export const createLWWMapSynchronizer = (options) => (components) => new LWWMapSynchronizer(components, options);
