import * as cborg from "cborg";
import { CRDT } from "./CRDT.js";
import { BufferMap } from "@organicdesign/buffer-collections";
export class GCounter extends CRDT {
    constructor(config, options = {}) {
        super(config);
        this.data = new BufferMap();
        this.dp = 10;
        if (options === null || options === void 0 ? void 0 : options.dp) {
            this.dp = options.dp;
        }
    }
    sync(data) {
        if (data == null) {
            return this.serialize();
        }
        const counts = cborg.decode(data);
        for (const iCount of counts) {
            const { id, count } = iCount;
            if (count == null) {
                continue;
            }
            const lValue = this.data.get(id);
            if (lValue == null || count > lValue) {
                this.data.set(id, count);
            }
        }
    }
    serialize() {
        const data = [];
        for (const [id, count] of this.data) {
            data.push({ id, count });
        }
        return cborg.encode(data);
    }
    deserialize(data) {
        this.sync(data);
    }
    onBroadcast(data) {
        const { id, count } = cborg.decode(data);
        if (count == null) {
            return;
        }
        if (this.compareSelf(id, count)) {
            this.data.set(id, count);
        }
    }
    toValue() {
        return this.round([...this.data.values()].reduce((p, c) => p + c, 0));
    }
    increment(quantity) {
        var _a;
        if (quantity < 0) {
            return;
        }
        const cValue = (_a = this.data.get(this.id)) !== null && _a !== void 0 ? _a : 0;
        const nValue = cValue + quantity;
        this.update(nValue);
    }
    update(value) {
        if (this.compareSelf(this.id, value)) {
            this.data.set(this.id, value);
            this.broadcast(cborg.encode({
                id: this.id,
                count: value
            }));
        }
    }
    round(count) {
        return Number(count.toFixed(this.dp));
    }
    // Returns true if the value passed is larger than the one stored.
    compareSelf(key, value) {
        var _a;
        return value > ((_a = this.data.get(key)) !== null && _a !== void 0 ? _a : 0);
    }
}
export const createGCounter = (config, options = {}) => new GCounter(config, options);
