import * as cborg from "cborg";
import { StateCRDT } from "./StateCRDT.js";
export class GCounter extends StateCRDT {
    constructor(config) {
        super(config, (a, b) => a > b, 0);
    }
    toValue() {
        return [...this.data.values()].reduce((p, c) => p + c, 0);
    }
    increment(quantity) {
        var _a;
        if (quantity < 0) {
            return;
        }
        const id = this.config.id;
        const cValue = (_a = this.data.get(id)) !== null && _a !== void 0 ? _a : 0;
        const nValue = cValue + quantity;
        this.update(nValue);
    }
}
export const createGCounter = (config) => new GCounter(config);
export const deserializeGCounter = (data) => {
    const { id, sync } = cborg.decode(data);
    const counter = new GCounter({ id });
    counter.sync(sync);
    return counter;
};
