# Change log

## 10.1.0

- option to disable image detection

## 10.0.6

- fix object not iterable in SSR

## 10.0.5

- add missing null check

## 10.0.4

- fix error in SSR

## 10.0.3

- move item outside of the viewport instead of using opacity and z-index

## 10.0.2

- delay the event when there is no image
- set z-index to -1 when item is not loaded

## 10.0.1

- emit event when all of the items are loaded

## 10.0.0 beta

- update to Angular 10
- support synchronous loading

## 9.X

- update the version number to match angular version
- `masonry-layout` is now a peerDependency, not a dependency
- expose `reloadItems()` function
- remove `imagesLoaded` and support images loading by default
- option `transitionDuration` was removed
- use angular animation and support customized animations
- html watcher was removed for better performance. Users need to have their own listener and call `layout()` when certain events are triggered
- support prepend item
