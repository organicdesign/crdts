import type { CRDTBroadcaster, CreateBroadcaster } from "../../../crdt-interfaces/src/index.js";
import * as cborg from "cborg";

export type MVRegisterBroadcasterComponents = {
	onChange (watcher: (values: unknown[], logical: number) => void): void
	set (values: unknown[], logical: number): void
}

export interface MVRegisterBroadcasterOpts {
	protocol: string
	listenOnly: boolean
}

export class MVRegisterBroadcaster implements CRDTBroadcaster {
	private readonly components: MVRegisterBroadcasterComponents;
	private readonly config: MVRegisterBroadcasterOpts;
	private broadcast: (data: Uint8Array) => void = () => {};

	constructor(components: MVRegisterBroadcasterComponents, options: Partial<MVRegisterBroadcasterOpts> = {}) {
		this.config = {
			protocol: options.protocol ?? "/mv-register/cbor/0.1.0",
			listenOnly: options.listenOnly ?? false
		};

		this.components = components;

		this.components.onChange((values, logical) => this.onChange(values, logical));
	}

	get protocol () {
		return this.config.protocol;
	}

	onBroadcast (data: Uint8Array) {
		const { values, logical } = cborg.decode(data) as { values: unknown[], logical: number };

		this.components.set(values, logical);
	}

	setBroadcast (broadcast: (data: Uint8Array) => void) {
		this.broadcast = broadcast;
	}

	private onChange (values: unknown[], logical: number) {
		const data = cborg.encode({ values, logical });

		if (!this.config.listenOnly) {
			this.broadcast(data);
		}
	}
}

export const createMVRegisterBroadcaster =
	(options?: Partial<MVRegisterBroadcasterOpts>): CreateBroadcaster<MVRegisterBroadcaster, MVRegisterBroadcasterComponents> =>
		(components: MVRegisterBroadcasterComponents) => new MVRegisterBroadcaster(components, options);
