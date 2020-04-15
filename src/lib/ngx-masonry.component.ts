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

  // Outputs
  @Output() layoutComplete: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() removeComplete: EventEmitter<any[]> = new EventEmitter<any[]>();

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

    this.options['transitionDuration'] = '0s'

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

  // public add(element: HTMLElement, prepend: boolean = false) {
  public add(element: HTMLElement) {
    // Tell Masonry that a child element has been added
    this.masonryInstance.appended(element);

    // Check if first item
    if (this.masonryInstance.items.length === 1) {
      this.masonryInstance.layout();
    }
  }

  public remove(element: HTMLElement) {
    // Tell Masonry that a child element has been removed
    this.masonryInstance.remove(element);

    // Layout items
    this.layout();
  }
}
