import type {
	SynchronizableCRDT,
	CRDTConfig,
	BMap,
	CreateCRDT
} from "@organicdesign/crdt-interfaces";
import { CRDT } from "./CRDT.js";
import { LWWRegister, LWWRegisterConfig, createLWWRegister } from "./LWWRegister.js";
import { createLWWMapSynchronizer, LWWMapSyncComponents as SyncComps } from "./synchronizers/LWWMap.js";

export interface LWWMapConfig extends CRDTConfig<SyncComps> {}

export interface LWWMapOpts<T> {
	createLWWRegister: CreateCRDT<LWWRegister<T>, LWWRegisterConfig>
}

export class LWWMap<T> extends CRDT<SyncComps> implements SynchronizableCRDT, BMap<T> {
	protected data = new Map<string, LWWRegister<T>>();
	protected readonly options: LWWMapOpts<T>;

	[Symbol.iterator](): IterableIterator<[string, T]> {
		const data = this.data;

		function* itr () {
			for (const [key, reg] of data) {
				if (reg.get() != null ) {
					yield [key, reg.get()] as [string, T];
				}
			}
		}

		return itr();
	}

	constructor (config: CRDTConfig<SyncComps>, settings: Partial<LWWMapOpts<T>> = {}) {
		config.synchronizers = config.synchronizers ?? [createLWWMapSynchronizer()];

		super(config);

		this.options = {
			createLWWRegister: settings.createLWWRegister ?? createLWWRegister
		};

		// Disable serialization and broadcast.
		Object.defineProperties(this, {
			getSerializers: { value: undefined },
			getBroadcasters: { value: undefined }
		});
	}

	protected assign (key: string, register: LWWRegister<T>) {
		/*
		crdt.addBroadcaster?.((data: Uint8Array) => {
			this.broadcast(cborg.encode({
				[key]: data
			}));
		});
		*/

		this.data.set(key, register);
	}

	start () {
		this.setup({
			keys: () => this.data.keys(),

			get: (key: string) => {
				// Create register if it does not exist.
				if (!this.data.has(key)) {
					const newReg = this.options.createLWWRegister({ id: this.id });

					newReg.start();

					this.assign(key, newReg);
					return this.data.get(key) as LWWRegister<T>;
				}

				return this.data.get(key);
			}
		});
	}

	get size(): number {
		return this.data.size;
	}

	keys(): IterableIterator<string> {
		const data = this.data;

		function* itr () {
			for (const [key, value] of data.entries()) {
				if (value.get() != null) {
					yield key;
				}
			}
		}

		return itr();
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
			const newReg = this.options.createLWWRegister({ id: this.id });

			newReg.start();

			this.assign(key, newReg);
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
			if (reg.get() != null) {
				output.set(key, reg.get());
			}
		}

		return output;
	}
}

export const createLWWMap =
	<T>(config: LWWMapConfig, settings?: Partial<LWWMapOpts<T>>) =>
		new LWWMap<T>(config, settings);
