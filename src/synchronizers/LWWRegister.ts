import type { CRDTSynchronizer, SyncContext } from "@organicdesign/crdt-interfaces";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import * as cborg from "cborg";

interface Timestamp {
	physical: number,
	logical: number,
	id: Uint8Array
}

export interface LWWRegisterSyncComponents {
	getValue (): { value: unknown, timestamp: Timestamp }
	setValue (value: unknown, timestamp: Timestamp): void
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
				physical: localValue.timestamp.physical,
				logical: localValue.timestamp.logical
			})
		}

		this.update(data, id);
	}

	private update (data: Uint8Array, id: Uint8Array) {
		const { value, physical, logical } = cborg.decode(data) as { value: unknown, physical: number, logical: number };

		const localValue = this.components.getValue();
		const localTimestamp = localValue.timestamp;

		const newValue = { value: localValue.value, timestamp: localValue.timestamp };

		if (physical === localTimestamp.physical && logical === localTimestamp.logical) {
			// Timestamps happened at the same time, we need to decide what happened first.
			if (uint8ArrayToString(id) > uint8ArrayToString(localTimestamp.id)) {
				newValue.value = value;
				newValue.timestamp.id = id;
			}
		} else if (physical > localTimestamp.physical || logical > localTimestamp.logical) {
			newValue.value = value;
			newValue.timestamp.physical = Math.max(physical, localTimestamp.physical);
			newValue.timestamp.logical = physical > localTimestamp.physical ? 0 : logical;
			newValue.timestamp.id = id;
		}

		this.components.setValue(newValue.value, newValue.timestamp);
	}
}

export const createLWWRegisterSynchronizer = (options?: Partial<LWWRegisterSyncOpts>) => (components: LWWRegisterSyncComponents) => new LWWRegisterSynchronizer(components, options);
