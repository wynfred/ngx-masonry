# Angular Module for displaying a feed of items in a masonry layout using [https://github.com/desandro/masonry](https://github.com/desandro/masonry)

This package was originally a fork from [https://github.com/jelgblad/angular2-masonry](https://github.com/jelgblad/angular2-masonry) to allow it to work with newer versions of Angular.

This updated version is also compatible with Angular Universal server side rendering (SSR)

[![npm version](https://badge.fury.io/js/ngx-masonry.svg)](https://www.npmjs.com/package/ngx-masonry)

### V9 beta
- update the version number to match angular version
- `masonry-layout` is now a peerDependency, not a dependency
- expose `reloadItems()` function
- remove `imagesLoaded` and support images loading by default
- option `transitionDuration` was removed
- use angular animation and support customized animations
- html watcher was removed for better performance. Users need to have their own listener and call `layout()` when certain events are triggered

## Installation

`npm install ngx-masonry masonry-layout --save`

## Usage

Import `NgxMasonryModule` into your app's modules:

```typescript
import { NgxMasonryModule } from 'ngx-masonry';

@NgModule({
  imports: [NgxMasonryModule]
})
```

```typescript
@Component({
  selector: 'my-component',
  template: `
     <ngx-masonry>
       <div ngxMasonryItem class="masonry-item" *ngFor="let item of masonryItems">
        {{item.title}}
      </div>
     </ngx-masonry>
     `,
  styles: [
    `
      .masonry-item { width: 200px; }
    `
  ]
})
class MyComponent {
  masonryItems = [
    { title: 'item 1' },
    { title: 'item 2' },
    { title: 'item 3' },
  ];
}
```

## Configuration

### Options

Read about Masonry options here: [Masonry Options](http://masonry.desandro.com/options.html)

The `options`-attribute takes an object with the following properties:

* itemSelector: string;
* columnWidth: number | string;
* gutter: number;
* percentPosition: boolean;
* stamp: string;
* fitWidth: boolean;
* originLeft: boolean;
* originTop: boolean;
* containerStyle: string;
* resize: boolean;
* initLayout: boolean;
* horizontalOrder: boolean;
* animations: NgxMasonryAnimations;

#### Examples

Inline object:

```html
<ngx-masonry [options]="{ gutter: 10 }"></ngx-masonry>
```

From parent component:

```typescript
import { NgxMasonryOptions } from 'ngx-masonry';

public myOptions: MasonryOptions = {
  gutter: 10
};
```

```html
<ngx-masonry [options]="myOptions"></ngx-masonry>
```

### imagesLoaded

imagesLoaded is removed in V9. masonry item will support image by default

### updateLayout

ngx-masonry has an input property, `updateLayout`, which accepts a boolean and will call masonry's `layout()` method on a change. It ignores the first change when the component loads.

```html
<ngx-masonry [updateLayout]="updateMasonryLayout"></ngx-masonry>
```

When `updateMasonryLayout` is updated, the `layout()` method will be called.

### animations

You can create and set customized animations with this option.

```typescript
  animations = {
    show: [
      style({opacity: 0}),
      animate('400ms ease-in', style({opacity: 1})),
    ],
    hide: [
      style({opacity: '*'}),
      animate('400ms ease-in', style({opacity: 0})),
    ]
  }

  // To disable animation
  animations = {}
```

## Events

### layoutComplete: `EventEmitter<any[]>`

Triggered after a layout and all positioning transitions have completed.

> [http://masonry.desandro.com/events.html#layoutcomplete](http://masonry.desandro.com/events.html#layoutcomplete)

### removeComplete: `EventEmitter<any[]>`

Triggered after an item element has been removed.

> [http://masonry.desandro.com/events.html#removecomplete](http://masonry.desandro.com/events.html#removecomplete)

### Examples

```html
<ngx-masonry (layoutComplete)="doStuff($event)" (removeComplete)="doOtherStuff($event)"></ngx-masonry>
```

## FAQ
* Why does masonry have wrong order?

The new item is always appended to the list because there is no "insert" function supported in masonry-layout. If the order changed and you want to update the order of items, use `reloadItems()`
```typescript
// get reference
@ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;

// after the order of items has changed
this.masonry.reloadItems();
this.masonry.layout();
```

* Why is the transitionDuration option not supported?

The builtin animation of masonry-layout doesn't work with angular well.

For more information refer to this issue:

https://github.com/wynfred/ngx-masonry/issues/8

* How to setup if I use SystemJS?

If you're using SystemJS add `ngx-masonry` and `masonry-layout` to your configuration:

```json
packages: {
  "ngx-masonry": { "defaultExtension": "js", "main": "index" }
},
map: {
  "ngx-masonry": "node_modules/ngx-masonry",
  "masonry-layout": "node_modules/masonry-layout/dist/masonry.pkgd.js"
}
```

## Demo

This repository contains a working app using ngx-masonry as a child module, not as an npm package. You can go to the [demo respository](https://github.com/wynfred/ngx-masonry-demo) to view an app that uses it as an npm package.

[View a live demo here](https://ngx-masonry-demo.herokuapp.com/)
