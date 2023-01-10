import * as cborg from "cborg";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { CRDT } from "./CRDT.js";
export class LWWRegister extends CRDT {
    constructor() {
        super(...arguments);
        this.timestamp = "";
        this.lastId = new Uint8Array();
    }
    get() {
        return this.data;
    }
    set(value) {
        this.data = value;
        this.timestamp = this.generateTimestamp();
        this.lastId = this.id;
        this.broadcast(cborg.encode({
            value,
            timestamp: this.timestamp,
            id: this.id
        }));
    }
    clear() {
        this.data = undefined;
        this.timestamp = this.generateTimestamp();
        this.lastId = this.id;
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
            timestamp: this.timestamp,
            id: this.lastId
        });
    }
    onBroadcast(data) {
        const { id } = cborg.decode(data);
        this.update(data, id);
    }
    update(data, id) {
        const { value, timestamp } = cborg.decode(data);
        if (timestamp === this.timestamp) {
            // Timestamps happened at the same time, we need to decide what happened first.
            if (uint8ArrayToString(id) > uint8ArrayToString(this.lastId)) {
                this.data = value;
                this.lastId = id;
            }
            return;
        }
        if (timestamp > this.timestamp) {
            this.data = value;
            this.timestamp = timestamp;
            this.lastId = id;
        }
    }
}
export const createLWWRegister = (config) => new LWWRegister(config);
