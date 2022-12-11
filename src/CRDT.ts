import type { CRDTConfig } from "crdt-interfaces";

export class CRDT {
	protected readonly config: CRDTConfig;
	private readonly broadcasters: ((data: Uint8Array) => void)[] = [];

	constructor (config: CRDTConfig) {
		this.config = config;
	}

	addBroadcaster (broadcaster: (data: Uint8Array) => void) {
		this.broadcasters.push(broadcaster);
	}

	get id () : Uint8Array {
		return this.config.id;
	}

	protected get generateTimestamp () {
		return this.config.generateTimestamp ?? (() => Date.now().toString(16));
	}

	protected broadcast (data: Uint8Array) {
		for (const broadcaster of this.broadcasters) {
			broadcaster(data);
		}
	}
}
