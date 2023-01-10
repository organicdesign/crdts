import * as cborg from "cborg";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { CRDT } from "./CRDT.js";
export class LWWRegister extends CRDT {
    constructor() {
        super(...arguments);
        this.physical = 0;
        this.logical = 0;
        this.lastId = new Uint8Array();
    }
    get() {
        return this.data;
    }
    set(value) {
        const physical = this.generateTimestamp();
        this.data = value;
        this.logical = physical > this.physical ? 0 : this.logical + 1;
        this.physical = Math.max(physical, this.physical);
        this.lastId = this.id;
        this.broadcast(cborg.encode({
            value,
            physical: this.physical,
            logical: this.logical,
            id: this.id
        }));
    }
    clear() {
        const physical = this.generateTimestamp();
        this.data = undefined;
        this.logical = physical > this.physical ? 0 : this.logical + 1;
        this.physical = Math.max(physical, this.physical);
        this.lastId = this.id;
        this.broadcast(cborg.encode({
            value: undefined,
            physical: this.physical,
            logical: this.logical,
            id: this.id
        }));
    }
    sync(data, { id }) {
        if (data == null) {
            return this.serialize();
        }
        this.update(data, id);
    }
    toValue() {
        return this.data;
    }
    serialize() {
        return cborg.encode({
            value: this.data,
            physical: this.physical,
            logical: this.logical,
            id: this.lastId
        });
    }
    onBroadcast(data) {
        const { id } = cborg.decode(data);
        this.update(data, id);
    }
    update(data, id) {
        const { value, physical, logical } = cborg.decode(data);
        if (physical === this.physical && logical === this.logical) {
            // Timestamps happened at the same time, we need to decide what happened first.
            if (uint8ArrayToString(id) > uint8ArrayToString(this.lastId)) {
                this.data = value;
                this.lastId = id;
            }
            return;
        }
        if (physical > this.physical || logical > this.logical) {
            this.data = value;
            this.physical = Math.max(physical, this.physical);
            this.logical = physical > this.physical ? 0 : logical;
            this.lastId = id;
            return;
        }
    }
}
export const createLWWRegister = (config) => new LWWRegister(config);
