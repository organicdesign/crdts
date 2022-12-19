import * as cborg from "cborg";
import { GCounter } from "./GCounter.js";
import { CRDT } from "./CRDT.js";
export class PNCounter extends CRDT {
    constructor(config) {
        super(config);
        this.pCounter = new GCounter(config);
        this.nCounter = new GCounter(config);
        this.pCounter.addBroadcaster((pData) => this.broadcast(cborg.encode({ pData })));
        this.nCounter.addBroadcaster((nData) => this.broadcast(cborg.encode({ nData })));
    }
    sync(data) {
        if (data == null) {
            const pData = this.pCounter.sync();
            const nData = this.nCounter.sync();
            const syncObj = {};
            if (pData != null) {
                syncObj.pData = pData;
            }
            if (nData != null) {
                syncObj.nData = nData;
            }
            return cborg.encode(syncObj);
        }
        const { pData, nData } = cborg.decode(data);
        const syncObj = {};
        if (pData != null) {
            syncObj.pData = this.pCounter.sync(pData);
        }
        if (nData != null) {
            syncObj.nData = this.nCounter.sync(nData);
        }
        if (pData == null && nData == null) {
            return;
        }
        return cborg.encode(syncObj);
    }
    serialize() {
        return cborg.encode({
            pData: this.pCounter.serialize(),
            nData: this.nCounter.serialize()
        });
    }
    onBroadcast(data) {
        const { pData, nData } = cborg.decode(data);
        if (pData != null) {
            this.pCounter.onBroadcast(pData);
        }
        if (nData != null) {
            this.nCounter.onBroadcast(nData);
        }
    }
    toValue() {
        return this.pCounter.toValue() - this.nCounter.toValue();
    }
    increment(quantity) {
        this.pCounter.increment(quantity);
    }
    decrement(quantity) {
        this.nCounter.increment(quantity);
    }
}
export const createPNCounter = (config) => new PNCounter(config);
