import { CRDT } from "./CRDT.js";
import { createLWWRegister } from "./LWWRegister.js";
import { createLWWMapSynchronizer } from "./synchronizers/LWWMap.js";
export class LWWMap extends CRDT {
    [Symbol.iterator]() {
        const data = this.data;
        function* itr() {
            for (const [key, reg] of data) {
                yield [key, reg.get()];
            }
        }
        return itr();
    }
    constructor(config) {
        var _a;
        config.synchronizers = (_a = config.synchronizers) !== null && _a !== void 0 ? _a : [createLWWMapSynchronizer()];
        super(config);
        this.data = new Map();
        this.setup({
            keys: () => this.data.keys(),
            get: (key) => {
                // Create register if it does not exist.
                if (!this.data.has(key)) {
                    this.assign(key, createLWWRegister({ id: this.id }));
                    return this.data.get(key);
                }
                return this.data.get(key);
            }
        });
        // Disable serialization and broadcast.
        Object.defineProperties(this, {
            getSerializers: { value: undefined },
            getBroadcasters: { value: undefined }
        });
    }
    assign(key, register) {
        /*
        crdt.addBroadcaster?.((data: Uint8Array) => {
            this.broadcast(cborg.encode({
                [key]: data
            }));
        });
        */
        this.data.set(key, register);
    }
    get size() {
        return this.data.size;
    }
    keys() {
        return this.data.keys();
    }
    clear() {
        for (const reg of this.data.values()) {
            reg.clear();
        }
    }
    delete(key) {
        var _a;
        if (this.data.has(key)) {
            (_a = this.data.get(key)) === null || _a === void 0 ? void 0 : _a.clear();
            return true;
        }
        return false;
    }
    forEach(callbackfn, thisArg) {
        this.data.forEach((value, key) => {
            const regValue = value.get();
            if (regValue != null) {
                callbackfn.apply(thisArg, [regValue, key, this.toValue()]);
            }
        });
    }
    get(key) {
        var _a;
        return (_a = this.data.get(key)) === null || _a === void 0 ? void 0 : _a.get();
    }
    has(key) {
        var _a;
        return ((_a = this.data.get(key)) === null || _a === void 0 ? void 0 : _a.get()) != null;
    }
    set(key, value) {
        let reg = this.data.get(key);
        if (reg == null) {
            this.assign(key, createLWWRegister({ id: this.id }));
            reg = this.data.get(key);
        }
        reg.set(value);
        return this.toValue();
    }
    entries() {
        return this[Symbol.iterator]();
    }
    values() {
        const regs = this.data.values();
        function* itr() {
            for (const value of regs) {
                if (value.get() != null) {
                    yield value.get();
                }
            }
        }
        return itr();
    }
    toValue() {
        const output = new Map();
        for (const [key, reg] of this.data) {
            output.set(key, reg.get());
        }
        return output;
    }
}
export const createLWWMap = (config) => new LWWMap(config);
