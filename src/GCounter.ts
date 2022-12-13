import type { CRDT as ICRDT, CRDTConfig, MCounter, CreateCRDT } from "crdt-interfaces";
import { InstanceCount, CounterData } from "crdt-protocols/counter";
import { CRDT } from "./CRDT.js";
import { BufferMap } from "./BufferMap.js";

export class GCounter extends CRDT implements ICRDT, MCounter {
	protected readonly data = new BufferMap<number>();

	sync(data?: Uint8Array): Uint8Array | undefined {
		if (data == null) {
			return this.serialize();
		}

		const { data: instanceCounts } = CounterData.decode(data);

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
		const data: InstanceCount[] = [];

		for (const [id, count] of this.data) {
			data.push({ id: id, int: count });
		}

		return CounterData.encode({ data });
	}

	deserialize (data: Uint8Array) {
		this.sync(data);
	}

	onBroadcast(data: Uint8Array): void {
		const { id, int } = InstanceCount.decode(data);

		if (int == null) {
			return;
		}

		if (this.compareSelf(id, int)) {
			this.data.set(id, int);
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

			this.broadcast(InstanceCount.encode({
				id: this.id,
				int: value
			}));
		}
	}

	// Returns true if the value passed is larger than the one stored.
	private compareSelf (key: Uint8Array, value: number) {
		return value > (this.data.get(key) ?? 0);
	}
}

export const createGCounter: CreateCRDT<GCounter> = (config: CRDTConfig) => new GCounter(config);
