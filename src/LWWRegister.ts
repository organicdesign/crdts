import * as cborg from "cborg";
import { CRDT } from "./CRDT.js";
import type { CRDT as ICRDT, Register, CRDTConfig } from "crdt-interfaces";

export class LWWRegister<T> extends CRDT implements ICRDT, Register<T> {
	private data: T | undefined;
	private timestamp: string = "";

	get(): T | undefined {
		return this.data;
	}

	set(value: T): void {
		this.data = value;
		this.timestamp = this.generateTimestamp();

		this.broadcast(cborg.encode({
			value,
			timestamp: this.timestamp
		}));
	}

	clear(): void {
		this.data = undefined;
		this.timestamp = this.generateTimestamp();
	}

	sync(data?: Uint8Array): Uint8Array | undefined {
		if (data == null) {
			return this.serialize();
		}

		const { value, timestamp }: { value: T, timestamp: string } = cborg.decode(data);

		if (timestamp > this.timestamp) {
			this.data = value;
			this.timestamp = timestamp;
		}
	}

	toValue(): T | undefined {
		return this.data;
	}

	serialize(): Uint8Array {
		return cborg.encode({
			value: this.data,
			timestamp: this.timestamp
		});
	}

	onBroadcast (data: Uint8Array) {
		this.sync(data);
	}
}

export const createLWWRegister = <T>(config: CRDTConfig) => new LWWRegister<T>(config);
