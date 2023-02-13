import { createGCounter } from "./GCounter.js";
import { CRDT } from "./CRDT.js";
import { createPNCounterSynchronizer } from "./synchronizers/PNCounter.js";
import { createPNCounterSerializer } from "./serializers/PNCounter.js";
import { createPNCounterBroadcaster } from "./broadcasters/PNCounter.js";
export class PNCounter extends CRDT {
    constructor(config, options = {}) {
        var _a, _b, _c, _d, _e;
        config.synchronizers = (_a = config.synchronizers) !== null && _a !== void 0 ? _a : [createPNCounterSynchronizer()];
        config.serializers = (_b = config.serializers) !== null && _b !== void 0 ? _b : [createPNCounterSerializer()];
        config.broadcasters = (_c = config.broadcasters) !== null && _c !== void 0 ? _c : [createPNCounterBroadcaster()];
        super(config);
        this.options = {
            dp: (_d = options.dp) !== null && _d !== void 0 ? _d : 10,
            createGCounter: (_e = options.createGCounter) !== null && _e !== void 0 ? _e : createGCounter
        };
        this.pCounter = this.options.createGCounter({ id: config.id }, { dp: this.options.dp });
        this.nCounter = this.options.createGCounter({ id: config.id }, { dp: this.options.dp });
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
export const createPNCounter = (config, options) => new PNCounter(config, options);
