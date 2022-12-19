import * as cborg from "cborg";
import type { CRDT as ICRDT, MSet, CRDTConfig } from "crdt-interfaces";
import { CRDT } from "./CRDT.js";

export class GSet<T=unknown> extends CRDT implements ICRDT, MSet<T> {
	private data = new Set<T>();

	[Symbol.iterator](): IterableIterator<T> {
		return this.data[Symbol.iterator]();
	}

	add(value: T): Set<T> {
		this.data.add(value);

		const encoded = cborg.encode(value);

		this.broadcast(encoded);

		return this.toValue();
	}

	forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {
		return this.data.forEach(callbackfn, thisArg);
	}

	has(value: T): boolean {
		return this.data.has(value);
	}

	get size(): number {
		return this.data.size;
	}

	entries(): IterableIterator<[T, T]> {
		return this.data.entries();
	}

	keys(): IterableIterator<T> {
		return this.data.keys();
	}

	values(): IterableIterator<T> {
		return this.data.values();
	}

	sync(data?: Uint8Array): Uint8Array | undefined {
		if (data == null) {
			return this.serialize();
		}

		const decoded: T[] = cborg.decode(data);

		for (const value of decoded) {
			this.data.add(value);
		}
	}

	toValue(): Set<T> {
		return new Set(this.data);
	}

	serialize(): Uint8Array {
		return cborg.encode([...this.data.values()]);
	}

	onBroadcast(data: Uint8Array): void {
		const value = cborg.decode(data) as T;

		this.data.add(value);
	}
}

export const createGSet = <T>(config: CRDTConfig) => new GSet<T>(config);
