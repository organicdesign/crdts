import * as cborg from "cborg";
import { CRDT } from "./CRDT.js";
import type { CRDT as ICRDT, CRDTConfig, SyncContext } from "crdt-interfaces";

export class MultiCRDT<T extends ICRDT=ICRDT> extends CRDT implements ICRDT {
	protected data = new Map<string, T>();
	private create: (() => T) | undefined;

	constructor (config: CRDTConfig, create?: () => T) {
		super(config);

		this.create = create;
	}

	protected assign (key: string, crdt: T) {
		crdt.addBroadcaster?.((data: Uint8Array) => {
			this.broadcast(cborg.encode({
				[key]: data
			}));
		});

		this.data.set(key, crdt);
	}

	get size(): number {
		return this.data.size;
	}

	keys(): IterableIterator<string> {
		return this.data.keys();
	}

	sync(data: Uint8Array | undefined, context: SyncContext): Uint8Array | undefined {
		if (data == null) {
			const obj: Record<string, Uint8Array> = {};

			for (const [key, crdt] of this.data.entries()) {
				obj[key] = crdt.sync(data, context) as Uint8Array;
			}

			return cborg.encode(obj);
		}

		const decoded = cborg.decode(data) as Record<string, Uint8Array>;
		const obj: Record<string, Uint8Array> = {};

		for (const [key, subdata] of Object.entries(decoded)) {
			if (!this.data.has(key) && this.create != null) {
				this.assign(key, this.create());
			}

			const result = this.data.get(key)?.sync(subdata, context);

			if (result != null) {
				obj[key] = result;
			}
		}

		if (Object.values(obj).length > 0) {
			return cborg.encode(obj);
		}
	}

	toValue(): Map<string, unknown> {
		const output = new Map<string, unknown>();

		for (const [key, crdt] of this.data.entries()) {
			output.set(key, crdt.toValue());
		}

		return output;
	}

	serialize(): Uint8Array {
		const obj: Record<string, Uint8Array> = {};

		for (const [key, crdt] of this.data.entries()) {
			if (crdt.serialize) {
				obj[key] = crdt.serialize();
			}
		}

		return cborg.encode(obj);
	}

	onBroadcast(data: Uint8Array): void {
		const decoded: Record<string, Uint8Array> = cborg.decode(data);

		for (const [key, value] of Object.entries(decoded)) {
			let subCrdt = this.data.get(key);

			if (subCrdt == null && this.create) {
				subCrdt = this.create();
				this.assign(key, subCrdt);
			}

			subCrdt?.onBroadcast?.(value);
		}
	}
}
