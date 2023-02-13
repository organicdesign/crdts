import { BufferMap } from "@organicdesign/buffer-collections";
import { CRDT } from "./CRDT.js";
import { createGCounterSynchronizer } from "./synchronizers/GCounter.js";
import { createGCounterSerializer } from "./serializers/GCounter.js";
import { createGCounterBroadcaster } from "./broadcasters/GCounter.js";
export class GCounter extends CRDT {
    constructor(config, options = {}) {
        var _a, _b, _c;
        config.synchronizers = (_a = config.synchronizers) !== null && _a !== void 0 ? _a : [createGCounterSynchronizer()];
        config.serializers = (_b = config.serializers) !== null && _b !== void 0 ? _b : [createGCounterSerializer()];
        config.broadcasters = (_c = config.broadcasters) !== null && _c !== void 0 ? _c : [createGCounterBroadcaster()];
        super(config);
        this.data = new BufferMap();
        this.dp = 10;
        if (options === null || options === void 0 ? void 0 : options.dp) {
            this.dp = options.dp;
        }
        this.watchers = new Map();
    }
    change(peer, count) {
        for (const watcher of this.watchers.values()) {
            watcher(peer, count);
        }
    }
    start() {
        this.setup({
            getPeers: () => this.data.keys(),
            get: (peer) => { var _a; return (_a = this.data.get(peer)) !== null && _a !== void 0 ? _a : 0; },
            set: (peer, count) => {
                var _a;
                const existing = (_a = this.data.get(peer)) !== null && _a !== void 0 ? _a : 0;
                if (existing < count) {
                    this.data.set(peer, count);
                }
            },
            onChange: (method) => {
                this.watchers.set(Math.random().toString(), method);
            }
        });
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
            this.change(this.id, value);
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
