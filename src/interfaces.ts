export interface CRDT {
	sync (data?: Uint8Array): Uint8Array
	toValue (): unknown
  serialize (): Uint8Array
}

export type deserialize = <T extends CRDT=CRDT>(data: Uint8Array) => T;
