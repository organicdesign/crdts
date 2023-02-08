import { CRDT } from "./CRDT.js";
import { createGSetSynchronizer } from "./synchronizers/GSet.js";
import { createGSetSerializer } from "./serializers/GSet.js";
import { createGSetBroadcaster } from "./broadcasters/GSet.js";
export class GSet extends CRDT {
    constructor(config) {
        var _a, _b, _c;
        config.synchronizers = (_a = config.synchronizers) !== null && _a !== void 0 ? _a : [createGSetSynchronizer()];
        config.serializers = (_b = config.serializers) !== null && _b !== void 0 ? _b : [createGSetSerializer()];
        config.broadcasters = (_c = config.broadcasters) !== null && _c !== void 0 ? _c : [createGSetBroadcaster()];
        super(config);
        this.data = new Set();
        this.watchers = new Map();
        this.setup({
            get: () => this.data,
            add: (item) => this.data.add(item),
            onChange: (method) => {
                this.watchers.set(Math.random().toString(), method);
            }
        });
    }
    change(item) {
        for (const watcher of this.watchers.values()) {
            watcher(item);
        }
    }
    [Symbol.iterator]() {
        return this.data[Symbol.iterator]();
    }
    add(value) {
        this.data.add(value);
        this.change(value);
        return this.toValue();
    }
    forEach(callbackfn, thisArg) {
        return this.data.forEach(callbackfn, thisArg);
    }
    has(value) {
        return this.data.has(value);
    }
    get size() {
        return this.data.size;
    }
    entries() {
        return this.data.entries();
    }
    keys() {
        return this.data.keys();
    }
    values() {
        return this.data.values();
    }
    toValue() {
        return new Set(this.data);
    }
}
export const createGSet = (config) => new GSet(config);
