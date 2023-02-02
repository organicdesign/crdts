import type { CRDTSynchronizer, SynchronizableCRDT, SyncContext } from "@organicdesign/crdt-interfaces";
import * as cborg from "cborg";

export interface LWWMapSyncComponents {
	getKeys (): Iterable<string>
	getValue (key: string): SynchronizableCRDT
}

export interface LWWMapSyncOpts {
	protocol: string
	subProtocol: string
}

export class LWWMapSynchronizer implements CRDTSynchronizer {
	private readonly components: LWWMapSyncComponents;
	private readonly options: LWWMapSyncOpts;

	constructor(components: LWWMapSyncComponents, options: Partial<LWWMapSyncOpts> = {}) {
		this.options = {
			protocol: options.protocol ?? "/lww-map/cbor/0.1.0",
			subProtocol: options.subProtocol ?? "/lww-register/cbor/0.1.0"
		};

		this.components = components;
	}

	get protocol () {
		return this.options.protocol;
	}

	sync (data: Uint8Array | undefined, context: SyncContext): Uint8Array | undefined {
		if (data == null) {
			const output: Record<string, Uint8Array> = {};

			for (const key of this.components.getKeys()) {
				const syncData = this.components.getValue(key)?.getSynchronizer(this.options.subProtocol)?.sync(undefined, context);

				if (syncData != null) {
					output[key] = syncData;
				}
			}

			return cborg.encode(output);
		}

		const syncData = cborg.decode(data) as Record<string, Uint8Array>;
		const syncObj: Record<string, Uint8Array> = {};

		for (const key of Object.keys(syncData)) {
			const newSyncData = this.components.getValue(key)?.getSynchronizer(this.options.subProtocol)?.sync(syncData[key], context);

			if (newSyncData != null) {
				syncObj[key] = newSyncData;
			}
		}

		if (Object.keys(syncObj).length === 0) {
			return;
		}

		return cborg.encode(syncObj);
	}
}

export const createLWWMapSynchronizer = (options?: Partial<LWWMapSyncOpts>) => (components: LWWMapSyncComponents) => new LWWMapSynchronizer(components, options);
