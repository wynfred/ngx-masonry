import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var require: any;
let masonryConstructor: any;

import { NgxMasonryOptions } from './ngx-masonry-options';
import { NgxMasonryDirective } from './ngx-masonry.directive';

@Component({
  selector: '[ngx-masonry], ngx-masonry',
  template: '<ng-content></ng-content>',
  styles: [
    `
		:host {
			display: block;
		}
	`
  ]
})
export class NgxMasonryComponent implements OnInit, OnChanges, OnDestroy {
  constructor(@Inject(PLATFORM_ID) private platformId: any, private _element: ElementRef) {}

  public masonryInstance: any;

  // Inputs
  @Input() public options: NgxMasonryOptions;
  @Input() updateLayout = false;
  @Input() ordered = false;

  // Outputs
  @Output() layoutComplete: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() removeComplete: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() itemsLoaded: EventEmitter<number> = new EventEmitter<number>();

  private pendingItems = [];

  ngOnInit() {

    if (isPlatformBrowser(this.platformId) && masonryConstructor === undefined) {
      masonryConstructor = require('masonry-layout');
    }

    // Create masonry options object
    if (!this.options) {
      this.options = {};
    }

    // Set default itemSelector
    if (!this.options.itemSelector) {
      this.options.itemSelector = '[ngxMasonryItem], ngxMasonryItem';
    }

    this.options['transitionDuration'] = '0s';

    if (isPlatformBrowser(this.platformId)) {
      // Initialize Masonry
      this.masonryInstance = new masonryConstructor(this._element.nativeElement, this.options);

      // Bind to events
      this.masonryInstance.on('layoutComplete', (items: any) => {
        this.layoutComplete.emit(items);
      });
      this.masonryInstance.on('removeComplete', (items: any) => {
        this.removeComplete.emit(items);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // only update layout if it's not the first change
    if (changes.updateLayout) {
      if (!changes.updateLayout.firstChange) {
        this.layout();
      }
    }
  }

  ngOnDestroy() {
    if (this.masonryInstance) {
      this.masonryInstance.destroy();
    }
  }

  public layout() {
    setTimeout(() => {
      this.masonryInstance.layout();
    });
  }

  public reloadItems() {
    setTimeout(() => {
      this.masonryInstance.reloadItems();
    });
  }

  public addPendingItem(item: NgxMasonryDirective) {
    this.pendingItems.push(item);
  }

  public add(newItem: NgxMasonryDirective) {
    if (this.ordered) {
      for (const [index, item] of this.pendingItems.entries()) {
        if (item) {
          if (item.images.size === 0) {
            this.pendingItems[index] = undefined;
            this.itemLoaded(item);
            if (index + 1 === this.pendingItems.length) {
              // All items are loaded
              this.itemsLoaded.emit(this.pendingItems.length);
              this.pendingItems = [];
            }
          } else {
            return;
          }
        }
      }
    } else {
      this.itemLoaded(newItem);
    }
  }

  private itemLoaded(item: NgxMasonryDirective) {
    // Tell Masonry that a child element has been added
    if (item.prepend) {
      this.masonryInstance.prepended(item.element.nativeElement);
    } else {
      this.masonryInstance.appended(item.element.nativeElement);
    }

    // Check if first item
    if (this.masonryInstance.items.length === 1) {
      this.masonryInstance.layout();
    }
    item.playAnimation(true);
  }

  public remove(element: HTMLElement) {
    // Tell Masonry that a child element has been removed
    this.masonryInstance.remove(element);

    // Layout items
    this.layout();
  }
}
