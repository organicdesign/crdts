import { CRDT as CRDTClass } from "./CRDT.js";
import * as cborg from "cborg";
export class StateCRDT extends CRDTClass {
    constructor(config, compare, defaultValue) {
        super(config);
        this.data = new Map();
        // Compare should return true if a is greater than b.
        this.compare = compare;
        this.defaultValue = defaultValue;
    }
    sync(data) {
        if (data == null) {
            return this.createSyncObj();
        }
        const obj = cborg.decode(data);
        for (const [key, rValue] of Object.entries(obj)) {
            const lValue = this.data.get(key);
            if (lValue == null || this.compare(rValue, lValue)) {
                this.data.set(key, rValue);
            }
        }
    }
    serialize() {
        const data = {
            id: this.id,
            sync: this.createSyncObj()
        };
        return cborg.encode(data);
    }
    createSyncObj() {
        const obj = {};
        for (const [key, value] of this.data) {
            obj[key] = value;
        }
        return cborg.encode(obj);
    }
    update(value) {
        const id = this.config.id;
        if (this.compareSelf(id, value)) {
            this.data.set(id, value);
            this.broadcast(cborg.encode({
                [id]: value
            }));
        }
    }
    onBroadcast(data) {
        const obj = cborg.decode(data);
        for (const [key, rValue] of Object.entries(obj)) {
            if (this.compareSelf(key, rValue)) {
                this.data.set(key, rValue);
            }
        }
    }
    // Returns true if the value passed is larger than the one stored.
    compareSelf(key, value) {
        var _a;
        const lValue = (_a = this.data.get(key)) !== null && _a !== void 0 ? _a : this.defaultValue;
        return lValue == null || this.compare(value, lValue);
    }
}
