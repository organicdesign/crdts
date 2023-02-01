import type { CRDTBroadcaster, BroadcastableCRDT } from "../../../crdt-interfaces/src/index.js";
import * as cborg from "cborg";

export interface PNCounterBroadcasterComponents {
	getPCounter (): BroadcastableCRDT
	getNCounter (): BroadcastableCRDT
}

export interface PNCounterBroadcasterOpts {
	protocol: string
	listenOnly: boolean
	subProtocol: string
}

export class PNCounterBroadcaster implements CRDTBroadcaster {
	private readonly components: PNCounterBroadcasterComponents;
	private readonly options: PNCounterBroadcasterOpts;
	private broadcast: (data: Uint8Array) => void = () => {};

	constructor(components: PNCounterBroadcasterComponents, options: Partial<PNCounterBroadcasterOpts> = {}) {
		this.options = {
			protocol: options.protocol ?? "/pn-counter/cbor/0.1.0",
			subProtocol: options.subProtocol ?? "/g-counter/cbor/0.1.0",
			listenOnly: options.listenOnly ?? false
		};

		this.components = components;

		this.components.getPCounter().getBroadcaster(this.options.subProtocol)?.setBroadcast(data => this.onSubBroadcast(data, "P"));
		this.components.getNCounter().getBroadcaster(this.options.subProtocol)?.setBroadcast(data => this.onSubBroadcast(data, "N"));
	}

	get protocol () {
		return this.options.protocol;
	}

	onBroadcast (data: Uint8Array) {
		const { subData, type } = cborg.decode(data) as { subData: Uint8Array, type: "P" | "N" };

		if (type === "P") {
			this.components.getPCounter().getBroadcaster(this.options.subProtocol)?.onBroadcast(subData);
		}

		if (type === "N") {
			this.components.getNCounter().getBroadcaster(this.options.subProtocol)?.onBroadcast(subData);
		}
	}

	setBroadcast (broadcast: (data: Uint8Array) => void) {
		this.broadcast = broadcast;
	}

	private onSubBroadcast (data: Uint8Array, type: "P" | "N") {
		if (!this.options.listenOnly) {
			this.broadcast(cborg.encode({ subData: data, type }));
		}
	}
}

export const createPNCounterBroadcaster = (options?: Partial<PNCounterBroadcasterOpts>) => (components: PNCounterBroadcasterComponents) => new PNCounterBroadcaster(components, options);
