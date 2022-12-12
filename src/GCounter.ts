import * as cborg from "cborg";
import type { CRDT as ICRDT, CRDTConfig, MCounter, CreateCRDT } from "crdt-interfaces";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { CRDT } from "./CRDT.js";

export class GCounter extends CRDT implements ICRDT, MCounter {
	protected readonly data = new Map<string, number>();
	private readonly compare: (a: number, b: number) => boolean;
	private readonly defaultValue?: number;

	constructor (config: CRDTConfig) {
		super(config);

		// Compare should return true if a is greater than b.
		this.compare = (a: number, b:number) => a > b;
		this.defaultValue = 0;
	}

	sync(data?: Uint8Array): Uint8Array | undefined {
		if (data == null) {
			return this.createSyncObj();
		}

		const obj: Record<string, number> = cborg.decode(data);

		for (const [key, rValue] of Object.entries(obj)) {
			const lValue = this.data.get(key);

			if (lValue == null || this.compare(rValue, lValue)) {
				this.data.set(key, rValue);
			}
		}
	}

	serialize(): Uint8Array {
		const data = {
			id: this.id,
			sync: this.createSyncObj()
		};

		return cborg.encode(data);
	}

	deserialize (data: Uint8Array) {
		const { id, sync }: { id: Uint8Array, sync: Uint8Array } = cborg.decode(data);

		this.sync(sync);
	}

	onBroadcast(data: Uint8Array): void {
		const obj = cborg.decode(data);

		for (const [key, rValue] of Object.entries(obj)) {
			if (this.compareSelf(key, rValue as number)) {
				this.data.set(key, rValue as number);
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

		const cValue = this.data.get(uint8ArrayToString(this.id)) ?? 0;
		const nValue = cValue + quantity;

		this.update(nValue);
	}

	protected update (value: number) {
		const id = this.config.id;

		if (this.compareSelf(uint8ArrayToString(id), value)) {
			this.data.set(uint8ArrayToString(id), value);

			this.broadcast(cborg.encode({
				[uint8ArrayToString(id)]: value
			}));
		}
	}

	private createSyncObj () {
		const obj: Record<string, number> = {};

		for (const [key, value] of this.data) {
			obj[key] = value;
		}

		return cborg.encode(obj);
	}

	// Returns true if the value passed is larger than the one stored.
	private compareSelf (key: string, value: number) {
		const lValue = this.data.get(key) ?? this.defaultValue;

		return lValue == null || this.compare(value, lValue);
	}
}

export const createGCounter: CreateCRDT<GCounter> = (config: CRDTConfig) => new GCounter(config);
