# Angular Module for displaying a feed of items in a masonry layout using [https://github.com/desandro/masonry](https://github.com/desandro/masonry)

This package was originally a fork from [https://github.com/jelgblad/angular2-masonry](https://github.com/jelgblad/angular2-masonry) to allow it to work with newer versions of Angular.

This updated version is also compatible with Angular Universal server side rendering (SSR)

[![npm version](https://badge.fury.io/js/ngx-masonry.svg)](https://www.npmjs.com/package/ngx-masonry)

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

### Ordered

Append new items synchronously. The order of the items will be preserved, but one image in the middle will block the reset of the images.

```typescript
<ngx-masonry [options]="masonryOptions" [ordered]="true">
```

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

Note that due to https://github.com/wynfred/ngx-masonry/issues/8 ngx-masonry comes without builtin animations of moving masonry items (when they change size or screen changes size). You can implement them using a css transition. Just add item css class let's say "masonry-item" and add this css code.

```css
.masonry-item {
  transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
}
```

### Image Lazyload
When using any lazyload methods layout, you can add `masonryLazy` attribute to the images.

Note: When using `masonryLazy`, the layout would have an overlapping issue. If you have this issue, you would need a custom method to maintain the layout, such as adding the fixed width/height to each image. For using the image lazyload method, you can have fallback image and loading indicator is recommended.

Example:
```html
  <img masonryLazy loading="lazy" width="500px" height="300px"/>
```

## Events

### layoutComplete: `EventEmitter<any[]>`

Triggered after a layout and all positioning transitions have completed.

> [http://masonry.desandro.com/events.html#layoutcomplete](http://masonry.desandro.com/events.html#layoutcomplete)

### removeComplete: `EventEmitter<any[]>`

Triggered after an item element has been removed.

> [http://masonry.desandro.com/events.html#removecomplete](http://masonry.desandro.com/events.html#removecomplete)

### itemsLoaded: `EventEmitter<number>`

Should only be used with `ordered` mode. Triggered after the last item is loaded.

### Examples

```html
<ngx-masonry (layoutComplete)="doStuff($event)" (removeComplete)="doOtherStuff($event)"></ngx-masonry>
```

## FAQ

* How to maintain the order of items if there are images?

  * Set `[ordered]` to true.
  * To insert item at the beginning: prepend the item to the array **and** set `prepend` to true.

    ```typescript
    <div ngxMasonryItem [prepend]="image.prepend" *ngFor="let image of masonryImages">
    ```

  * If item is inserted or the list is shuffled, use `reloadItems()`

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

* Where is imagesLoaded?

  imagesLoaded is removed in V9. masonry item will support image by default

## Demo

This repository contains a working app using ngx-masonry as a child module, not as an npm package. You can go to the [demo respository](https://github.com/wynfred/ngx-masonry-demo) to view an app that uses it as an npm package.

[View a live demo here](https://ngx-masonry-demo.herokuapp.com/)
