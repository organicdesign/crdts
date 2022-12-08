import * as cborg from "cborg";
import { CRDT } from "./CRDT.js";
export class LWWRegister extends CRDT {
    constructor() {
        super(...arguments);
        this.timestamp = "";
    }
    get() {
        return this.data;
    }
    set(value) {
        this.data = value;
        this.timestamp = this.generateTimestamp();
        this.broadcast(cborg.encode({
            value,
            timestamp: this.timestamp
        }));
    }
    clear() {
        this.data = undefined;
        this.timestamp = this.generateTimestamp();
    }
    sync(data) {
        if (data == null) {
            return this.serialize();
        }
        const { value, timestamp } = cborg.decode(data);
        if (timestamp > this.timestamp) {
            this.data = value;
            this.timestamp = timestamp;
        }
    }
    toValue() {
        return this.data;
    }
    serialize() {
        return cborg.encode({
            value: this.data,
            timestamp: this.timestamp
        });
    }
    onBroadcast(data) {
        this.sync(data);
    }
}
export const createLWWRegister = (config) => new LWWRegister(config);
