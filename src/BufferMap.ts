import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";

export class BufferMap<V> implements Map<Uint8Array, V> {
	private data = new Map<string, V>();

	get [Symbol.toStringTag] () {
		return this.data[Symbol.toStringTag];
	}

	[Symbol.iterator](): IterableIterator<[Uint8Array, V]> {
		const itr = this.data.entries();

		return (function* () {
			for (const [str, value] of itr) {
				yield [uint8ArrayFromString(str), value];
			}
		})();
	}

	constructor (iterable?: Iterable<[Uint8Array, V]>) {
		if (iterable != null) {
			this.data = new Map((function* () {
				for (const [buf, value] of iterable) {
					yield [uint8ArrayToString(buf), value];
				}
			})());
		}
	}

	clear (): void {
		this.data.clear();
	}

	delete (key: Uint8Array): boolean {
		return this.data.delete(uint8ArrayToString(key));
	}

	forEach (callbackfn: (value: V, key: Uint8Array, map: this) => void, thisArg?: any): void {
		this.data.forEach((value: V, key: string) => {
			callbackfn.apply(thisArg, [value, uint8ArrayFromString(key), this]);
		});
	}

	get (key: Uint8Array): V | undefined {
		return this.data.get(uint8ArrayToString(key));
	}

	has (key: Uint8Array): boolean {
		return this.data.has(uint8ArrayToString(key));
	}

	set (key: Uint8Array, value: V): this {
		this.data.set(uint8ArrayToString(key), value);

		return this;
	}

	entries(): IterableIterator<[Uint8Array, V]> {
		return this[Symbol.iterator]();
	}

	values (): IterableIterator<V> {
		return this.data.values();
	}

	keys (): IterableIterator<Uint8Array> {
		const itr = this.data.keys();

		return (function* () {
			for (const key of itr) {
				yield uint8ArrayFromString(key);
			}
		})();
	}

	get size () {
		return this.data.size;
	}
}
