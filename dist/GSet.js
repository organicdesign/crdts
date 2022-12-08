import * as cborg from "cborg";
import { CRDT } from "./CRDT.js";
export class GSet extends CRDT {
    constructor() {
        super(...arguments);
        this.data = new Set();
    }
    [Symbol.iterator]() {
        return this.data[Symbol.iterator]();
    }
    add(value) {
        this.data.add(value);
        const encoded = cborg.encode(value);
        this.broadcast(encoded);
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
    sync(data) {
        if (data == null) {
            return cborg.encode([...this.data.values()]);
        }
        const decoded = cborg.decode(data);
        for (const value of decoded) {
            this.data.add(value);
        }
    }
    toValue() {
        return new Set(this.data);
    }
    serialize() {
        return cborg.encode([...this.data.values()]);
    }
    onBroadcast(data) {
        const value = cborg.decode(data);
        this.data.add(value);
    }
}
export const createGSet = (config) => new GSet(config);
