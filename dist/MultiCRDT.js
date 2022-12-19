import * as cborg from "cborg";
import { CRDT } from "./CRDT.js";
export class MultiCRDT extends CRDT {
    constructor(config, create) {
        super(config);
        this.data = new Map();
        this.create = create;
    }
    assign(key, crdt) {
        var _a;
        (_a = crdt.addBroadcaster) === null || _a === void 0 ? void 0 : _a.call(crdt, (data) => {
            this.broadcast(cborg.encode({
                [key]: data
            }));
        });
        this.data.set(key, crdt);
    }
    get size() {
        return this.data.size;
    }
    keys() {
        return this.data.keys();
    }
    sync(data, context) {
        var _a;
        if (data == null) {
            const obj = {};
            for (const [key, crdt] of this.data.entries()) {
                obj[key] = crdt.sync(data, context);
            }
            return cborg.encode(obj);
        }
        const decoded = cborg.decode(data);
        const obj = {};
        for (const [key, subdata] of Object.entries(decoded)) {
            if (!this.data.has(key) && this.create != null) {
                this.assign(key, this.create());
            }
            const result = (_a = this.data.get(key)) === null || _a === void 0 ? void 0 : _a.sync(subdata, context);
            if (result != null) {
                obj[key] = result;
            }
        }
        if (Object.values(obj).length > 0) {
            return cborg.encode(obj);
        }
    }
    toValue() {
        const output = new Map();
        for (const [key, crdt] of this.data.entries()) {
            output.set(key, crdt.toValue());
        }
        return output;
    }
    serialize() {
        const obj = {};
        for (const [key, crdt] of this.data.entries()) {
            if (crdt.serialize) {
                obj[key] = crdt.serialize();
            }
        }
        return cborg.encode(obj);
    }
    onBroadcast(data) {
        var _a;
        const decoded = cborg.decode(data);
        for (const [key, value] of Object.entries(decoded)) {
            let subCrdt = this.data.get(key);
            if (subCrdt == null && this.create) {
                subCrdt = this.create();
                this.assign(key, subCrdt);
            }
            (_a = subCrdt === null || subCrdt === void 0 ? void 0 : subCrdt.onBroadcast) === null || _a === void 0 ? void 0 : _a.call(subCrdt, value);
        }
    }
}
