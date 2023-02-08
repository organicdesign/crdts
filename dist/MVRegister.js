import { CRDT } from "./CRDT.js";
import { createMVRegisterSynchronizer } from "./synchronizers/MVRegister.js";
import { createMVRegisterSerializer } from "./serializers/MVRegister.js";
import { createMVRegisterBroadcaster } from "./broadcasters/MVRegister.js";
export class MVRegister extends CRDT {
    constructor(config) {
        var _a, _b, _c;
        config.synchronizers = (_a = config.synchronizers) !== null && _a !== void 0 ? _a : [createMVRegisterSynchronizer()];
        config.serializers = (_b = config.serializers) !== null && _b !== void 0 ? _b : [createMVRegisterSerializer()];
        config.broadcasters = (_c = config.broadcasters) !== null && _c !== void 0 ? _c : [createMVRegisterBroadcaster()];
        super(config);
        this.data = new Set();
        this.logical = 0;
        this.watchers = new Map();
        this.setup({
            get: () => ({
                values: [...this.data],
                logical: this.logical
            }),
            set: (values, logical) => {
                if (logical === this.logical) {
                    for (const value of values) {
                        this.data.add(value);
                    }
                }
                else {
                    this.data = new Set(values);
                    this.logical = logical;
                }
            },
            onChange: (method) => {
                this.watchers.set(Math.random().toString(), method);
            }
        });
    }
    change(values, logical) {
        for (const watcher of this.watchers.values()) {
            watcher(values, logical);
        }
    }
    get() {
        return [...this.data];
    }
    set(value) {
        this.data = new Set([value]);
        this.logical++;
        this.change([value], this.logical);
    }
    clear() {
        this.data = new Set();
        this.logical++;
        this.change([undefined], this.logical);
    }
    toValue() {
        return [...this.data].sort();
    }
}
export const createMVRegister = (config) => new MVRegister(config);
