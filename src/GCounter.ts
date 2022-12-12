import * as cborg from "cborg";
import type { CRDT as ICRDT, CRDTConfig, MCounter, CreateCRDT } from "crdt-interfaces";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { CRDT } from "./CRDT.js";
import { BufferMap } from "./BufferMap.js";

export class GCounter extends CRDT implements ICRDT, MCounter {
	protected readonly data = new BufferMap<number>();

	sync(data?: Uint8Array): Uint8Array | undefined {
		if (data == null) {
			return this.serialize();
		}

		const { data: instanceCounts }: { data: { id: Uint8Array, int: number }[] } = cborg.decode(data);

		for (const { id, int } of instanceCounts) {
			if (int == null) {
				continue;
			}

			const lValue = this.data.get(id);

			if (lValue == null || int > lValue) {
				this.data.set(id, int);
			}
		}
	}

	serialize(): Uint8Array {
		const data: { id: Uint8Array, int: number }[] = [];

		for (const [id, count] of this.data) {
			data.push({ id: id, int: count });
		}

		return cborg.encode({ data });
	}

	deserialize (data: Uint8Array) {
		this.sync(data);
	}

	onBroadcast(data: Uint8Array): void {
		const obj = cborg.decode(data);

		for (const [key, rValue] of Object.entries(obj)) {
			if (this.compareSelf(uint8ArrayFromString(key), rValue as number)) {
				this.data.set(uint8ArrayFromString(key), rValue as number);
			}
		}
	}

	toValue(): number {
		return [...this.data.values()].reduce((p, c) => p + c, 0);
	}

	increment(quantity: number): void {
		if (quantity < 0) {
			return;
		}

		const cValue = this.data.get(this.id) ?? 0;
		const nValue = cValue + quantity;

		this.update(nValue);
	}

	protected update (value: number) {
		if (this.compareSelf(this.id, value)) {
			this.data.set(this.id, value);

			this.broadcast(cborg.encode({
				[uint8ArrayToString(this.id)]: value
			}));
		}
	}

	// Returns true if the value passed is larger than the one stored.
	private compareSelf (key: Uint8Array, value: number) {
		return value > (this.data.get(key) ?? 0);
	}
}

export const createGCounter: CreateCRDT<GCounter> = (config: CRDTConfig) => new GCounter(config);
