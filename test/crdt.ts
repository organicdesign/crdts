import createSyncTests from "./sync.js";
import createSerialTests from "./serialize.js";
import createBroadcastTests from "./broadcast.js";
import type { CRDT, Deserialize } from "../src/interfaces.js";

export default <T extends CRDT=CRDT>(
	create: (id: string) => T,
	action: (crdt: T, index: number) => void,
	deserialize?: Deserialize<T>
) => {
	describe("Sync", () => {
		createSyncTests(
			(id: string) => create(id),
			action
		);
	});

	const dummy = create("dummy");

	if (dummy.addBroadcaster != null && dummy.onBroadcast != null) {
		describe("Broadcast", () => {
			createBroadcastTests(
				(id: string) => create(id),
				action
			);
		});
	}

	if (dummy.serialize != null && deserialize != null) {
		describe("Serialization", () => {
			createSerialTests(
				(id: string) => create(id),
				action,
				deserialize
			);
		});
	}
};
