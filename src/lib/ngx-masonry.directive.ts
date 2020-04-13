import { Directive, Inject, ElementRef, forwardRef, OnDestroy, AfterViewInit, Renderer2 } from '@angular/core';

import { NgxMasonryComponent } from './ngx-masonry.component';

interface MutationWindow extends Window {
  MutationObserver: any;
  WebKitMutationObserver: any;
}

declare var window: MutationWindow;

@Directive({
  selector: '[ngxMasonryItem], ngxMasonryItem'
})
export class NgxMasonryDirective implements OnDestroy, AfterViewInit {
  private images: Set<HTMLImageElement>;

  constructor(
    private element: ElementRef,
    @Inject(forwardRef(() => NgxMasonryComponent)) private parent: NgxMasonryComponent,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit() {
      const images = this.element.nativeElement.getElementsByTagName('img');
      if (images.length === 0) {
        this.parent.add(this.element.nativeElement);
      } else {
        for (const imageRef of images) {
          this.renderer.listen(imageRef, 'load', event => {
            this.imageLoaded(imageRef);
          });
          this.renderer.listen(imageRef, 'error', event => {
            this.imageLoaded(imageRef);
          });
        }
      }
      this.images = new Set(images);
      this.watchForHtmlChanges();
  }

  ngOnDestroy() {
    if (this.images.size === 0) {
      this.parent.remove(this.element.nativeElement);
    }
  }

  private imageLoaded(image: HTMLImageElement) {
    this.images.delete(image);
    if (this.images.size === 0) {
      this.parent.add(this.element.nativeElement);
    }
  }

  /** When HTML in brick changes dinamically, observe that and change layout */
  private watchForHtmlChanges(): void {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    if (MutationObserver) {
      /** Watch for any changes to subtree */
      const self = this;
      const observer = new MutationObserver(function(mutations, observerFromElement) {
        self.parent.layout();
      });

      // define what element should be observed by the observer
      // and what types of mutations trigger the callback
      observer.observe(this.element.nativeElement, {
        subtree: true,
        childList: true
      });
    }
  }
}
