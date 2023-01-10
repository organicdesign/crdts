import * as cborg from "cborg";
import type { CRDT as ICRDT, MVRegister as IMVRegister, CRDTConfig } from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";

export class MVRegister<T> extends CRDT implements ICRDT, IMVRegister<T> {
	private data = new Set<T>();
	private logical: number = 0;

	get(): T[] {
		return [...this.data];
	}

	set(value: T): void {
		this.data = new Set<T>([ value ]);
		this.logical++;

		this.broadcast(cborg.encode({
			value: [value],
			logical: this.logical
		}));
	}

	clear(): void {
		this.data = new Set<T>();
		this.logical++;

		this.broadcast(cborg.encode({
			value: undefined,
			logical: this.logical
		}));
	}

	sync(data: Uint8Array | undefined): Uint8Array | undefined {
		if (data == null) {
			return this.serialize();
		}

		const { value, logical } = cborg.decode(data) as { value: T[], logical: number };

		if (logical === this.logical) {
			for (const item of value) {
				this.data.add(item);
			}
		}

		if (logical > this.logical) {
			this.data = new Set<T>(value);
			this.logical = logical;

			return;
		}
	}

	toValue(): T[] {
		return [...this.data].sort();
	}

	serialize(): Uint8Array {
		return cborg.encode({
			value: [...this.data],
			logical: this.logical
		});
	}

	onBroadcast (data: Uint8Array) {
		this.sync(data);
	}
}

export const createMVRegister = <T>(config: CRDTConfig) => new MVRegister<T>(config);
