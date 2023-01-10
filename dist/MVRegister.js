import * as cborg from "cborg";
import { CRDT } from "./CRDT.js";
export class MVRegister extends CRDT {
    constructor() {
        super(...arguments);
        this.data = new Set();
        this.logical = 0;
    }
    get() {
        return [...this.data];
    }
    set(value) {
        this.data = new Set([value]);
        this.logical++;
        this.broadcast(cborg.encode({
            value: [value],
            logical: this.logical
        }));
    }
    clear() {
        this.data = new Set();
        this.logical++;
        this.broadcast(cborg.encode({
            value: undefined,
            logical: this.logical
        }));
    }
    sync(data) {
        if (data == null) {
            return this.serialize();
        }
        const { value, logical } = cborg.decode(data);
        if (logical === this.logical) {
            for (const item of value) {
                this.data.add(item);
            }
        }
        if (logical > this.logical) {
            this.data = new Set(value);
            this.logical = logical;
            return;
        }
    }
    toValue() {
        return [...this.data].sort();
    }
    serialize() {
        return cborg.encode({
            value: [...this.data],
            logical: this.logical
        });
    }
    onBroadcast(data) {
        this.sync(data);
    }
}
export const createMVRegister = (config) => new MVRegister(config);
