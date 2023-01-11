# CRDTs

A group of useful CRDTs implementing interfaces from `@organicdesign/crdt-interfaces`.

## Install

```
npm i @organicdesign/crdts
```

## CRDTs

Each CRDT exposes a class, an instantiation method and if applicable, a deserialize method. Most of these CRDTs use a basic protocol encoded in CBOR and have room for improvement in regards to efficiency and specification.

If you are using these CRDTs with Libp2p you should use the peer ID as the CRDT id:
```javascript
createCRDT({ id: libp2p.peerId.toBytes() });
```

### G-Counter

```javascript
import { createGCounter } from "@organicdesign/crdts";

createGCounter({ id: new Uint8Array([123]) });
```

A grow only counter.

### PN-Counter

```javascript
import { createPNCounter } from "@organicdesign/crdts";

createPNCounter({ id: new Uint8Array([123]) });
```

A positive/negative counter (one that can grow and shrink).

### G-Set

```javascript
import { createGSet } from "@organicdesign/crdts";

createGSet({ id: new Uint8Array([123]) });
```

A grow only set.

### MV-Register
```javascript
import { createMVRegister } from "@organicdesign/crdts";

createMVRegister({ id: new Uint8Array([123]) });
```

A multi-value register. This register relies on logical time only and will return an array with all values that are set at the same time.

### LWW-Register

```javascript
import { createLWWRegister } from "@organicdesign/crdts";

createLWWRegister({ id: new Uint8Array([123]) });
```

A last write wins register. Uses hybrid time and IDs to ensure consistency.

### LWW-Map

```javascript
import { createLWWMap } from "@organicdesign/crdts";

createLWWMap({ id: new Uint8Array([123]) });
```

A last write wins map. Uses hybrid time and IDs to ensure consistency.

### CRDT-Map

```javascript
import { createCRDTMap } from "@organicdesign/crdts";

createCRDTMap({ id: new Uint8Array([123]) });
```

A map containing only CRDTs as it's values. You will need to ensure each instance of this type has the same structure of values.

## Building

To build the project files run:

```sh
npm run build
```

## Testing

To run the tests:

```sh
npm run test
```

To lint files:

```sh
npm run lint
```
