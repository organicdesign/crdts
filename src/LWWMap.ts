import { MultiCRDT } from "./MultiCRDT.js";
import { LWWRegister } from "./LWWRegister.js";
import type { CRDT as ICRDT, BMap, CRDTConfig } from "crdt-interfaces";

export class LWWMap<T> extends MultiCRDT<LWWRegister<T>> implements ICRDT, BMap<T> {
	[Symbol.iterator](): IterableIterator<[string, T]> {
		const data = this.data;

		function* itr () {
			for (const [key, reg] of data) {
				yield [key, reg.get()] as [string, T];
			}
		}

		return itr();
	}

	constructor (config: CRDTConfig) {
		super(config, () => new LWWRegister(this.config));
	}

	clear(): void {
		for (const reg of this.data.values()) {
			reg.clear();
		}
	}

	delete(key: string): boolean {
		if (this.data.has(key)) {
			this.data.get(key)?.clear();
			return true;
		}

		return false;
	}

	forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void {
		this.data.forEach((value: LWWRegister<T>, key:string) => {
			const regValue = value.get();

			if(regValue != null) {
				callbackfn.apply(thisArg, [regValue, key, this.toValue()]);
			}
		});
	}

	get(key: string): T | undefined {
		return this.data.get(key)?.get();
	}

	has(key: string): boolean {
		return this.data.get(key)?.get() != null;
	}

	set(key: string, value: T): Map<string, T> {
		let reg = this.data.get(key);

		if (reg == null) {
			this.assign(key, new LWWRegister(this.config));
			reg = this.data.get(key) as LWWRegister<T>;
		}

		reg.set(value);

		return this.toValue();
	}

	entries(): IterableIterator<[string, T]> {
		return this[Symbol.iterator]();
	}

	values(): IterableIterator<T> {
		const regs = this.data.values();

		function* itr () {
			for (const value of regs) {
				if (value.get() != null) {
					yield value.get() as T;
				}
			}
		}

		return itr();
	}

	toValue(): Map<string, T> {
		const output = new Map();

		for (const [key, reg] of this.data) {
			output.set(key, reg.get());
		}

		return output;
	}
}

export const createLWWMap = <T>(config: CRDTConfig) => new LWWMap<T>(config);
