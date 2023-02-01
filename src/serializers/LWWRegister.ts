import type { CRDTSerializer } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";

interface Timestamp {
	physical: number,
	logical: number,
	id: Uint8Array
}

export interface LWWRegisterSerializerComponents {
	getValue (): { value: unknown, timestamp: Timestamp }
	setValue (value: unknown, timestamp: Timestamp): void
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
		return cborg.encode(this.components.getValue());
	}

	deserialize (data: Uint8Array) {
		const { value, timestamp } = cborg.decode(data) as { value: unknown, timestamp: Timestamp };

		this.components.setValue(value, timestamp);
	}
}

export const createLWWRegisterSerializer = (options?: Partial<LWWRegisterSyncOpts>) => (components: LWWRegisterSerializerComponents) => new LWWRegisterSerializer(components, options);
