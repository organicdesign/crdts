import type { CRDTBroadcaster } from "../../../crdt-interfaces/src/index.js";
import * as cborg from "cborg";

interface Timestamp {
	physical: number,
	logical: number,
	id: Uint8Array
}

export interface LWWRegisterBroadcasterComponents {
	onChange (watcher: (value: unknown, timestamp: Timestamp) => void): void
	setValue (value: unknown, timestamp: Timestamp): void
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

		this.components.onChange((value, timestamp) => this.onChange(value, timestamp));
	}

	get protocol () {
		return this.config.protocol;
	}

	onBroadcast (data: Uint8Array) {
		const { value, timestamp } = cborg.decode(data) as { value: unknown, timestamp: Timestamp };

		this.components.setValue(value, timestamp);
	}

	setBroadcast (broadcast: (data: Uint8Array) => void) {
		this.broadcast = broadcast;
	}

	private onChange (value: unknown, timestamp: Timestamp) {
		const data = cborg.encode({ value, timestamp });

		if (!this.config.listenOnly) {
			this.broadcast(data);
		}
	}
}

export const createLWWRegisterBroadcaster = (options?: Partial<LWWRegisterBroadcasterOpts>) => (components: LWWRegisterBroadcasterComponents) => new LWWRegisterBroadcaster(components, options);
