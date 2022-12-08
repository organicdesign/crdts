import * as cborg from "cborg";
import { GCounter } from "./GCounter.js";
import { CRDT } from "./CRDT.js";
var CounterType;
(function (CounterType) {
    CounterType[CounterType["PCounter"] = 0] = "PCounter";
    CounterType[CounterType["NCounter"] = 1] = "NCounter";
})(CounterType || (CounterType = {}));
export class PNCounter extends CRDT {
    constructor(config) {
        super(config);
        this.pCounter = new GCounter(config);
        this.nCounter = new GCounter(config);
        this.pCounter.addBroadcaster((data) => this.broadcast(cborg.encode({ type: CounterType.PCounter, data })));
        this.nCounter.addBroadcaster((data) => this.broadcast(cborg.encode({ type: CounterType.NCounter, data })));
    }
    sync(data) {
        if (data == null) {
            return cborg.encode([
                this.pCounter.sync(),
                this.nCounter.sync()
            ]);
        }
        let [pData, nData] = cborg.decode(data);
        if (pData != null) {
            pData = this.pCounter.sync(pData);
        }
        if (nData != null) {
            nData = this.nCounter.sync(nData);
        }
        if (pData == null && nData == null) {
            return;
        }
        return cborg.encode([pData, nData]);
    }
    serialize() {
        return cborg.encode([
            this.pCounter.serialize(),
            this.nCounter.serialize()
        ]);
    }
    onBroadcast(data) {
        const { type, data: subData } = cborg.decode(data);
        if (type === CounterType.PCounter) {
            this.pCounter.onBroadcast(subData);
        }
        else {
            this.nCounter.onBroadcast(subData);
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
