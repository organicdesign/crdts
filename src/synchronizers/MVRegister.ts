import type { CRDTSynchronizer } from "../../../crdt-interfaces/src/index.js";
import * as cborg from "cborg";

export interface MVRegisterSyncComponents {
	get (): { values: unknown[], logical: number }
	set (values: unknown[], logical: number): void
}

export interface MVRegisterSyncOpts {
	protocol: string
}

export class MVRegisterSynchronizer implements CRDTSynchronizer {
	public readonly protocol: string;
	private readonly components: MVRegisterSyncComponents;

	constructor(components: MVRegisterSyncComponents, options: Partial<MVRegisterSyncOpts> = {}) {
		this.protocol = options.protocol ?? "/mv-register/cbor/0.1.0";
		this.components = components;
	}

	sync (data?: Uint8Array): Uint8Array | undefined {
		if (data == null) {
			return cborg.encode(this.components.get());
		}

		const { values, logical } = cborg.decode(data) as { values: unknown[], logical: number };

		this.components.set(values, logical);
	}
}

export const createMVRegisterSynchronizer = (options?: Partial<MVRegisterSyncOpts>) => (components: MVRegisterSyncComponents) => new MVRegisterSynchronizer(components, options);
