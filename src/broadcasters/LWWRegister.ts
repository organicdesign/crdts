import type { CRDTBroadcaster } from "../../../crdt-interfaces/src/index.js";
import * as cborg from "cborg";

export interface LWWRegisterBroadcasterComponents {
	onChange (watcher: (value: unknown, physical: number, logical: number, id: Uint8Array) => void): void
	setValue (value: unknown, physical: number, logical: number, id: Uint8Array): void
}

export interface LWWRegisterBroadcasterOpts {
	protocol: string
	listenOnly: boolean
}

export class LWWRegisterBroadcaster implements CRDTBroadcaster {
	private readonly components: LWWRegisterBroadcasterComponents;
	private readonly config: LWWRegisterBroadcasterOpts;
	private broadcast: (data: Uint8Array) => void = () => {};

	constructor(components: LWWRegisterBroadcasterComponents, options: Partial<LWWRegisterBroadcasterOpts> = {}) {
		this.config = {
			protocol: options.protocol ?? "/lww-register/cbor/0.1.0",
			listenOnly: options.listenOnly ?? false
		};

		this.components = components;

		this.components.onChange((value, physical, logical, id) => this.onChange(value, physical, logical, id));
	}

	get protocol () {
		return this.config.protocol;
	}

	onBroadcast (data: Uint8Array) {
		const { value, physical, logical, id } = cborg.decode(data) as { value: unknown, physical: number, logical: number, id: Uint8Array };

		this.components.setValue(value, physical, logical, id);
	}

	setBroadcast (broadcast: (data: Uint8Array) => void) {
		this.broadcast = broadcast;
	}

	private onChange (value: unknown, physical: number, logical: number, id: Uint8Array) {
		const data = cborg.encode({ value, physical, logical, id });

		if (!this.config.listenOnly) {
			this.broadcast(data);
		}
	}
}

export const createLWWRegisterBroadcaster = (options?: Partial<LWWRegisterBroadcasterOpts>) => (components: LWWRegisterBroadcasterComponents) => new LWWRegisterBroadcaster(components, options);
