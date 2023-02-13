import { GCounter } from "./GCounter.js";
import { CRDT } from "./CRDT.js";
import { createPNCounterSynchronizer } from "./synchronizers/PNCounter.js";
import { createPNCounterSerializer } from "./serializers/PNCounter.js";
import { createPNCounterBroadcaster } from "./broadcasters/PNCounter.js";
export class PNCounter extends CRDT {
    constructor(config, options = {}) {
        var _a, _b, _c;
        config.synchronizers = (_a = config.synchronizers) !== null && _a !== void 0 ? _a : [createPNCounterSynchronizer()];
        config.serializers = (_b = config.serializers) !== null && _b !== void 0 ? _b : [createPNCounterSerializer()];
        config.broadcasters = (_c = config.broadcasters) !== null && _c !== void 0 ? _c : [createPNCounterBroadcaster()];
        if (options.dp == null) {
            options.dp = 10;
        }
        super(config);
        this.pCounter = new GCounter({ id: config.id }, options);
        this.nCounter = new GCounter({ id: config.id }, options);
    }
    start() {
        this.pCounter.start();
        this.nCounter.start();
        this.setup({
            getPCounter: () => this.pCounter,
            getNCounter: () => this.nCounter
        });
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
