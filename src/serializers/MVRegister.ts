import type { CRDTSerializer } from "../../../crdt-interfaces/src/index.js";
import * as cborg from "cborg";

export interface MVRegisterSerializerComponents {
	get (): { values: unknown[], logical: number }
	set (values: unknown[], logical: number): void
}

export interface MVRegisterSyncOpts {
	protocol: string
}

export class MVRegisterSerializer implements CRDTSerializer {
	public readonly protocol: string;
	private readonly components: MVRegisterSerializerComponents;

	constructor(components: MVRegisterSerializerComponents, options: Partial<MVRegisterSyncOpts> = {}) {
		this.protocol = options.protocol ?? "/mv-register/cbor/0.1.0";
		this.components = components;
	}

	serialize (): Uint8Array {
		return cborg.encode(this.components.get());
	}

	deserialize (data: Uint8Array) {
		const { values, logical } = cborg.decode(data) as { values: unknown[], logical: number };

		this.components.set(values, logical);
	}
}

export const createMVRegisterSerializer = (options?: Partial<MVRegisterSyncOpts>) => (components: MVRegisterSerializerComponents) => new MVRegisterSerializer(components, options);
