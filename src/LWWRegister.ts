import * as cborg from "cborg";
import type { CRDT as ICRDT, BRegister, CRDTConfig, SyncContext } from "@organicdesign/crdt-interfaces";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { CRDT } from "./CRDT.js";

export class LWWRegister<T> extends CRDT implements ICRDT, BRegister<T> {
	private data: T | undefined;
	private timestamp: string = "";
	private lastId: Uint8Array = new Uint8Array();

	get(): T | undefined {
		return this.data;
	}

	set(value: T): void {
		this.data = value;
		this.timestamp = this.generateTimestamp();
		this.lastId = this.id;

		this.broadcast(cborg.encode({
			value,
			timestamp: this.timestamp,
			id: this.id
		}));
	}

	clear(): void {
		this.data = undefined;
		this.timestamp = this.generateTimestamp();
		this.lastId = this.id;
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
			timestamp: this.timestamp,
			id: this.lastId
		});
	}

	onBroadcast (data: Uint8Array) {
		const { id } = cborg.decode(data) as { id: Uint8Array };

		this.update(data, id);
	}

	private update (data: Uint8Array, id: Uint8Array) {
		const { value, timestamp }: { value: T, timestamp: string } = cborg.decode(data) as { value: T, timestamp: string };

		if (timestamp === this.timestamp) {
			// Timestamps happened at the same time, we need to decide what happened first.
			if (uint8ArrayToString(id) > uint8ArrayToString(this.lastId)) {
				this.data = value;
				this.lastId = id;
			}

			return;
		}

		if (timestamp > this.timestamp) {
			this.data = value;
			this.timestamp = timestamp;
			this.lastId = id;
		}
	}
}

export const createLWWRegister = <T>(config: CRDTConfig) => new LWWRegister<T>(config);
