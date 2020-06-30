# Change log

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
