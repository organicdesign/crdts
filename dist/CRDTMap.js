import { createCRDTMapSynchronizer } from "@organicdesign/crdt-map-synchronizer";
import { CRDT } from "./CRDT.js";
export class CRDTMap extends CRDT {
    constructor(config) {
        var _a;
        config.synchronizers = (_a = config.synchronizers) !== null && _a !== void 0 ? _a : [createCRDTMapSynchronizer()];
        super(config);
        this.data = new Map();
        this.setup({
            keys: () => this.data.keys(),
            get: (key) => this.data.get(key),
            getId: () => this.id
        });
        // Disable serialization and broadcast.
        Object.defineProperties(this, {
            getSerializers: { value: undefined },
            getBroadcasters: { value: undefined }
        });
    }
    assign(key, crdt) {
        this.data.set(key, crdt);
    }
    [Symbol.iterator]() {
        return this.data[Symbol.iterator]();
    }
    get size() {
        return this.data.size;
    }
    keys() {
        return this.data.keys();
    }
    forEach(callbackfn, thisArg) {
        return this.data.forEach(callbackfn, thisArg);
    }
    get(key) {
        return this.data.get(key);
    }
    has(key) {
        return this.data.has(key);
    }
    set(key, value) {
        this.assign(key, value);
        return new Map(this.data.set(key, value));
    }
    entries() {
        return this.data.entries();
    }
    values() {
        return this.data.values();
    }
    toValue() {
        const output = new Map();
        for (const [key, crdt] of this.data.entries()) {
            output.set(key, crdt.toValue());
        }
        return output;
    }
}
export const createCRDTMap = (config) => new CRDTMap(config);
