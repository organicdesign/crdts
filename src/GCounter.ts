import * as cborg from "cborg";
import type { CRDT, CRDTConfig, MCounter, CreateCRDT } from "crdt-interfaces";
import { StateCRDT } from "./StateCRDT.js";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

export class GCounter extends StateCRDT<number> implements CRDT, MCounter {
	constructor(config: CRDTConfig) {
		super(config, (a: number, b:number) => a > b, 0);
	}

	toValue(): number {
		return [...this.data.values()].reduce((p, c) => p + c, 0);
	}

	deserialize (data: Uint8Array) {
		const { id, sync }: { id: Uint8Array, sync: Uint8Array } = cborg.decode(data);

		this.sync(sync);
	}

	increment(quantity: number): void {
		if (quantity < 0) {
			return;
		}

		const cValue = this.data.get(uint8ArrayToString(this.id)) ?? 0;
		const nValue = cValue + quantity;

		this.update(nValue);
	}
}

export const createGCounter: CreateCRDT<GCounter> = (config: CRDTConfig) => new GCounter(config);
