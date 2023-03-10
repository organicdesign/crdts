## [0.3.4](https://github.com/organicdesign/crdts/compare/v0.3.3...v0.3.4) (2023-02-21)

### Fixed

* Fixed LWWMap `keys`, `entries` and `[symbol.iterator]` methods returning values for empty registers.

## [0.3.3](https://github.com/organicdesign/crdts/compare/v0.3.2...v0.3.3) (2023-02-17)

### Fixed

* Added the start method to the documentation.

## [0.3.2](https://github.com/organicdesign/crdts/compare/v0.3.1...v0.3.2) (2023-02-14)

### Added

* Config types for all CRDTs.
* Creation method options for CRDTs with sub-CRDTs.

## [0.3.1](https://github.com/organicdesign/crdts/compare/v0.3.0...v0.3.1) (2023-02-13)

### Fixed

* Fixed wrong `this` reference in CRDT `setup`/`start`.

## [0.3.0](https://github.com/organicdesign/crdts/compare/v0.2.0...v0.3.0) (2023-02-13)

### Changed

* Update interfaces and make CRDTs startable.

## [0.2.0](https://github.com/organicdesign/crdts/compare/v0.1.4...v0.2.0) (2023-02-09)

### Changed
* Modified all the CRDTs to `@organicdesign/crdt-interfaces@0.4.0`

### Added

* Synchronizers
  * GCounter
  * GSet
  * LWWMap
  * LWWRegister
  * MVRegister
  * PNCounter
* Serializers
  * GCounter
  * GSet
  * LWWRegister
  * MVRegister
  * PNCounter
* Broadcasters
  * GCounter
  * GSet
  * LWWRegister
  * MVRegister
  * PNCounter

## [0.1.4](https://github.com/organicdesign/crdts/compare/v0.1.3...v0.1.4) (2023-01-17)

### Added

* Add keywords to package.json.
* Add table of contents to readme.

## [0.1.3](https://github.com/organicdesign/crdts/compare/v0.1.2...v0.1.3) (2023-01-16)

### Changed

* Expand readme code examples.

## [0.1.2](https://github.com/organicdesign/crdts/compare/v0.1.1...v0.1.2) (2023-01-12)

### Changed

* Improved readme examples.

## [0.1.1](https://github.com/organicdesign/crdts/compare/v0.1.0...v0.1.1) (2023-01-12)

### Added

* Added MV-Register crdt.

### Fixed

* Fixed wrong package being used in examples.

### Changed

* Changed LWW timestamps to hybrid time.

## 0.1.0 (2023-01-10)

### Added

* Added CRDTs:
  * G-Counter
  * PN-Counter
  * G-Set
  * LWW-Register
  * CRDT-Map
  * CRDT-Map
