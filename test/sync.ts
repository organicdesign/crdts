import { syncCrdts } from "../src/utils.js";
import type { CRDT } from "crdt-interfaces";

export default <T extends CRDT=CRDT>(
	create: (id: string) => T,
	action: (crdt: T, index: number) => void,
	instanceCount?: number
) => {
	if (instanceCount == null) {
		instanceCount = 20;
	}

	const name = create("dummy").constructor.name;

	const runSyncTest = (count: number) => {
		const crdts: T[] = [];

		for (let i = 1; i <= count; i++) {
			const crdt = create(`test-${i}`);

			action(crdt, i);

			crdts.push(crdt);
		}

		syncCrdts(crdts);

		const result = crdts[0].toValue();

		for (const crdt of crdts) {
			expect(crdt.toValue()).toStrictEqual(result);
		}
	};

	it(`Syncs 2 ${name}s`, () => {
		runSyncTest(2);
	});

	it(`Syncs ${instanceCount} ${name}s`, () => {
		runSyncTest(20);
	});
};
