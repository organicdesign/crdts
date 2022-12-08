# CRDTs

A group of useful CRDTs implementing interfaces from crdt-interfaces.

## CRDTs

Each CRDT exposes a class, a instantiation method and if applicable, a deserialize method.

### G-Counter

```javascript
import { createGCounter } from "crdts";
```

A grow only counter.

### PN-Counter

```javascript
import { createPNCounter } from "crdts";
```

A positive/negative counter (one that can grow and shrink).

### G-Set

```javascript
import { createGSet } from "crdts";
```

A grow only set.

### LWW-Register

```javascript
import { createLWWRegister } from "crdts";
```

A last write wins register. To ensure consistency you will need to provide an adequate method for generating timestamps that will never produce duplicate results.

### CRDT-Map

```javascript
import { createLWWMap } from "crdts";
```

A last write wins map. To ensure consistency you will need to provide an adequate method for generating timestamps that will never produce duplicate results.

### CRDT-Map

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
