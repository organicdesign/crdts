import { MultiCRDT } from "./MultiCRDT.js";
export class CRDTMap extends MultiCRDT {
    constructor(config) {
        super(config);
        this.data = new Map();
    }
    [Symbol.iterator]() {
        return this.data[Symbol.iterator]();
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
}
export const createCRDTMap = (config) => new CRDTMap(config);
