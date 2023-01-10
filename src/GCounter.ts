import * as cborg from "cborg";
import type { CRDT as ICRDT, CRDTConfig, MCounter, CreateCRDT } from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";
import { BufferMap } from "@organicdesign/buffer-collections";

export interface GCounterOpts {
	dp: number
}

export class GCounter extends CRDT implements ICRDT, MCounter {
	protected readonly data = new BufferMap<number>();
	protected readonly dp: number = 10;

	constructor (config: CRDTConfig, options: Partial<GCounterOpts> = {}) {
		super(config);

		if (options?.dp) {
			this.dp = options.dp;
		}
	}

	sync(data?: Uint8Array): Uint8Array | undefined {
		if (data == null) {
			return this.serialize();
		}

		const counts: { id: Uint8Array, count: number }[] = cborg.decode(data);

		for (const iCount of counts) {
			const { id, count } = iCount;

			if (count == null) {
				continue;
			}

			const lValue = this.data.get(id);

			if (lValue == null || count > lValue) {
				this.data.set(id, count);
			}
		}
	}

	serialize(): Uint8Array {
		const data: { id: Uint8Array, count: number }[] = [];

		for (const [id, count] of this.data) {
			data.push({ id, count });
		}

		return cborg.encode(data);
	}

	deserialize (data: Uint8Array) {
		this.sync(data);
	}

	onBroadcast(data: Uint8Array): void {
		const { id, count } = cborg.decode(data);

		if (count == null) {
			return;
		}

		if (this.compareSelf(id, count)) {
			this.data.set(id, count);
		}
	}

	toValue(): number {
		return this.round([...this.data.values()].reduce((p, c) => p + c, 0));
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
				id: this.id,
				count: value
			}));
		}
	}

	protected round (count: number) {
		return Number(count.toFixed(this.dp));
	}

	// Returns true if the value passed is larger than the one stored.
	private compareSelf (key: Uint8Array, value: number) {
		return value > (this.data.get(key) ?? 0);
	}
}

export const createGCounter: CreateCRDT<GCounter> = (config: CRDTConfig, options: Partial<GCounterOpts> = {}) => new GCounter(config, options);
