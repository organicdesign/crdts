import * as cborg from "cborg";
import type { CRDT, CRDTConfig, MCounter, Deserialize, CreateCRDT } from "crdt-interfaces";
import { StateCRDT } from "./StateCRDT.js";

export class GCounter extends StateCRDT<number> implements CRDT, MCounter {
	constructor(config: CRDTConfig) {
		super(config, (a: number, b:number) => a > b, 0);
	}

	toValue(): number {
		return [...this.data.values()].reduce((p, c) => p + c, 0);
	}

	increment(quantity: number): void {
		if (quantity < 0) {
			return;
		}

		const id = this.config.id;
		const cValue = this.data.get(id) ?? 0;
		const nValue = cValue + quantity;

		this.update(nValue);
	}
}

export const createGCounter: CreateCRDT<GCounter> = (config: CRDTConfig) => new GCounter(config);

export const deserializeGCounter: Deserialize<GCounter> = (data: Uint8Array) => {
	const { id, sync }: { id: string, sync: Uint8Array } = cborg.decode(data);
	const counter = new GCounter({ id });

	counter.sync(sync);

	return counter;
};
