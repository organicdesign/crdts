declare module "cborg" {
	function encode(data: unknown): Uint8Array;
	function decode(data: Uint8Array): unknown;
}
