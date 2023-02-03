import type { CRDTSerializer } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";

export interface LWWRegisterSerializerComponents {
	get (): { value: unknown, physical: number, logical: number, id: Uint8Array }
	set (value: unknown, physical: number, logical: number, id: Uint8Array): void
}

export interface LWWRegisterSyncOpts {
	protocol: string
}

export class LWWRegisterSerializer implements CRDTSerializer {
	public readonly protocol: string;
	private readonly components: LWWRegisterSerializerComponents;

	constructor(components: LWWRegisterSerializerComponents, options: Partial<LWWRegisterSyncOpts> = {}) {
		this.protocol = options.protocol ?? "/lww-register/cbor/0.1.0";
		this.components = components;
	}

	serialize (): Uint8Array {
		return cborg.encode(this.components.get());
	}

	deserialize (data: Uint8Array) {
		const { value, physical, logical, id } = cborg.decode(data) as { value: unknown, physical: number, logical: number, id: Uint8Array };

		this.components.set(value, physical, logical, id);
	}
}

export const createLWWRegisterSerializer = (options?: Partial<LWWRegisterSyncOpts>) => (components: LWWRegisterSerializerComponents) => new LWWRegisterSerializer(components, options);
