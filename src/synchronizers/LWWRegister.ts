import type { CRDTSynchronizer, SyncContext } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";

export interface LWWRegisterSyncComponents {
	getValue (): { value: unknown, physical: number, logical: number, id: Uint8Array }
	setValue (value: unknown, physical: number, logical: number, id: Uint8Array): void
}

export interface LWWRegisterSyncOpts {
	protocol: string
}

export class LWWRegisterSynchronizer implements CRDTSynchronizer {
	public readonly protocol: string;
	private readonly components: LWWRegisterSyncComponents;

	constructor(components: LWWRegisterSyncComponents, options: Partial<LWWRegisterSyncOpts> = {}) {
		this.protocol = options.protocol ?? "/lww-register/cbor/0.1.0";
		this.components = components;
	}

	sync (data: Uint8Array | undefined, { id }: SyncContext): Uint8Array | undefined {
		if (data == null) {
			const localValue = this.components.getValue();

			return cborg.encode({
				value: localValue.value,
				physical: localValue.physical,
				logical: localValue.logical
			})
		}

		const { value, physical, logical } = cborg.decode(data) as { value: unknown, physical: number, logical: number };

		this.components.setValue(value, physical, logical, id);
	}
}

export const createLWWRegisterSynchronizer = (options?: Partial<LWWRegisterSyncOpts>) => (components: LWWRegisterSyncComponents) => new LWWRegisterSynchronizer(components, options);
