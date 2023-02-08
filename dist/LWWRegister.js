import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { CRDT } from "./CRDT.js";
import { createLWWRegisterSynchronizer } from "./synchronizers/LWWRegister.js";
import { createLWWRegisterSerializer } from "./serializers/LWWRegister.js";
import { createLWWRegisterBroadcaster } from "./broadcasters/LWWRegister.js";
export class LWWRegister extends CRDT {
    constructor(config) {
        var _a, _b, _c;
        config.synchronizers = (_a = config.synchronizers) !== null && _a !== void 0 ? _a : [createLWWRegisterSynchronizer()];
        config.serializers = (_b = config.serializers) !== null && _b !== void 0 ? _b : [createLWWRegisterSerializer()];
        config.broadcasters = (_c = config.broadcasters) !== null && _c !== void 0 ? _c : [createLWWRegisterBroadcaster()];
        super(config);
        this.physical = 0;
        this.logical = 0;
        this.lastId = new Uint8Array();
        this.watchers = new Map();
        this.setup({
            get: () => ({
                value: this.data,
                physical: this.physical,
                logical: this.logical,
                id: this.lastId
            }),
            set: (value, physical, logical, id) => {
                if (physical === this.physical && logical === this.logical) {
                    // Timestamps happened at the same time, we need to decide what happened first.
                    if (uint8ArrayToString(id) > uint8ArrayToString(this.lastId)) {
                        this.data = value;
                        this.lastId = id;
                    }
                }
                else if (physical > this.physical || logical > this.logical) {
                    this.data = value;
                    this.physical = Math.max(physical, this.physical);
                    this.logical = physical > this.physical ? 0 : logical;
                    this.lastId = id;
                }
            },
            onChange: (method) => {
                this.watchers.set(Math.random().toString(), method);
            }
        });
    }
    change(value, physical, logical, id) {
        for (const watcher of this.watchers.values()) {
            watcher(value, physical, logical, id);
        }
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
        this.change(value, this.physical, this.logical, this.id);
    }
    clear() {
        const physical = this.generateTimestamp();
        this.data = undefined;
        this.logical = physical > this.physical ? 0 : this.logical + 1;
        this.physical = Math.max(physical, this.physical);
        this.lastId = this.id;
        this.change(undefined, this.physical, this.logical, this.id);
    }
    toValue() {
        return this.data;
    }
}
export const createLWWRegister = (config) => new LWWRegister(config);
