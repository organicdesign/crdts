import * as cborg from "cborg";
import type { CRDT as ICRDT, BRegister, CRDTConfig, SyncContext } from "@organicdesign/crdt-interfaces";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { CRDT } from "./CRDT.js";

export class LWWRegister<T> extends CRDT implements ICRDT, BRegister<T> {
	private data: T | undefined;
	private physical: number = 0;
	private logical: number = 0;
	private lastId: Uint8Array = new Uint8Array();

	get(): T | undefined {
		return this.data;
	}

	set(value: T): void {
		const physical = this.generateTimestamp();

		this.data = value;
		this.logical = physical > this.physical ? 0 : this.logical + 1;
		this.physical = Math.max(physical, this.physical);
		this.lastId = this.id;

		this.broadcast(cborg.encode({
			value,
			physical: this.physical,
			logical: this.logical,
			id: this.id
		}));
	}

	clear(): void {
		const physical = this.generateTimestamp();

		this.data = undefined;
		this.logical = physical > this.physical ? 0 : this.logical + 1;
		this.physical = Math.max(physical, this.physical);
		this.lastId = this.id;

		this.broadcast(cborg.encode({
			value: undefined,
			physical: this.physical,
			logical: this.logical,
			id: this.id
		}));
	}

	sync(data: Uint8Array | undefined, { id }: SyncContext): Uint8Array | undefined {
		if (data == null) {
			return this.serialize();
		}

		this.update(data, id);
	}

	toValue(): T | undefined {
		return this.data;
	}

	serialize(): Uint8Array {
		return cborg.encode({
			value: this.data,
			physical: this.physical,
			logical: this.logical,
			id: this.lastId
		});
	}

	onBroadcast (data: Uint8Array) {
		const { id } = cborg.decode(data) as { id: Uint8Array };

		this.update(data, id);
	}

	private update (data: Uint8Array, id: Uint8Array) {
		const { value, physical, logical } = cborg.decode(data) as { value: T, physical: number, logical: number };

		if (physical === this.physical && logical === this.logical) {
			// Timestamps happened at the same time, we need to decide what happened first.
			if (uint8ArrayToString(id) > uint8ArrayToString(this.lastId)) {
				this.data = value;
				this.lastId = id;
			}

			return;
		}

		if (physical > this.physical || logical > this.logical) {
			this.data = value;
			this.physical = Math.max(physical, this.physical);
			this.logical = physical > this.physical ? 0 : logical;
			this.lastId = id;

			return;
		}
	}
}

export const createLWWRegister = <T>(config: CRDTConfig) => new LWWRegister<T>(config);
