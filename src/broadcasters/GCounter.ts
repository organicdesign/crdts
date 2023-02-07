import type { CRDTBroadcaster, CreateBroadcaster } from "../../../crdt-interfaces/src/index.js";
import * as cborg from "cborg";

export type GCounterBroadcasterComponents = {
	onChange (watcher: (peer: Uint8Array, count: number) => void): void
	set (peer: Uint8Array, count: number): void
}

export interface GCounterBroadcasterOpts {
	protocol: string
	listenOnly: boolean
}

export class GCounterBroadcaster implements CRDTBroadcaster {
	private readonly components: GCounterBroadcasterComponents;
	private readonly config: GCounterBroadcasterOpts;
	private broadcast: (data: Uint8Array) => void = () => {};

	constructor(components: GCounterBroadcasterComponents, options: Partial<GCounterBroadcasterOpts> = {}) {
		this.config = {
			protocol: options.protocol ?? "/g-counter/cbor/0.1.0",
			listenOnly: options.listenOnly ?? false
		};

		this.components = components;

		this.components.onChange((peer, count) => this.onChange(peer, count));
	}

	get protocol () {
		return this.config.protocol;
	}

	onBroadcast (data: Uint8Array) {
		const { peer, count } = cborg.decode(data) as { peer: Uint8Array, count: number };

		this.components.set(peer, count);
	}

	setBroadcast (broadcast: (data: Uint8Array) => void) {
		this.broadcast = broadcast;
	}

	private onChange (peer: Uint8Array, count: number) {
		const data = cborg.encode({ peer, count });

		if (!this.config.listenOnly) {
			this.broadcast(data);
		}
	}
}

export const createGCounterBroadcaster =
	(options?: Partial<GCounterBroadcasterOpts>): CreateBroadcaster<GCounterBroadcasterComponents, GCounterBroadcaster> =>
		(components: GCounterBroadcasterComponents) => new GCounterBroadcaster(components, options);
