import type { CRDTBroadcaster } from "../../../crdt-interfaces/src/index.js";
import * as cborg from "cborg";

export interface GSetBroadcasterComponents {
	onChange (watcher: (item: unknown) => void): void
	add (item: unknown): void
}

export interface GSetBroadcasterOpts {
	protocol: string
	listenOnly: boolean
}

export class GSetBroadcaster implements CRDTBroadcaster {
	private readonly components: GSetBroadcasterComponents;
	private readonly config: GSetBroadcasterOpts;
	private broadcast: (data: Uint8Array) => void = () => {};

	constructor(components: GSetBroadcasterComponents, options: Partial<GSetBroadcasterOpts> = {}) {
		this.config = {
			protocol: options.protocol ?? "/g-set/cbor/0.1.0",
			listenOnly: options.listenOnly ?? false
		};

		this.components = components;

		this.components.onChange((item) => this.onChange(item));
	}

	get protocol () {
		return this.config.protocol;
	}

	onBroadcast (data: Uint8Array) {
		const item = cborg.decode(data) as { peer: Uint8Array, count: number };

		this.components.add(item);
	}

	setBroadcast (broadcast: (data: Uint8Array) => void) {
		this.broadcast = broadcast;
	}

	private onChange (item: unknown) {
		const data = cborg.encode(item);

		if (!this.config.listenOnly) {
			this.broadcast(data);
		}
	}
}

export const createGSetBroadcaster = (options?: Partial<GSetBroadcasterOpts>) => (components: GSetBroadcasterComponents) => new GSetBroadcaster(components, options);
