import { Directive, Inject, ElementRef, forwardRef, OnDestroy, AfterViewInit, Renderer2, OnInit, Input } from '@angular/core';
import { style, animate, AnimationBuilder } from '@angular/animations';

import { NgxMasonryComponent } from './ngx-masonry.component';
import { NgxMasonryAnimations } from './ngx-masonry-options';

@Directive({
  selector: '[ngxMasonryItem], ngxMasonryItem'
})
export class NgxMasonryDirective implements OnInit, OnDestroy, AfterViewInit {
  @Input() prepend = false;

  public elements: Set<HTMLImageElement | HTMLElement>;
  private selectedElements: HTMLImageElement[] | HTMLElement[];
  private detectImageLoad: boolean = true;
  private animations: NgxMasonryAnimations = {
    show: [
      style({opacity: 0}),
      animate('400ms ease-in', style({opacity: 1})),
    ],
    hide: [
      style({opacity: '*'}),
      animate('400ms ease-in', style({opacity: 0})),
    ]
  };

  constructor(
    public element: ElementRef,
    private builder: AnimationBuilder,
    @Inject(forwardRef(() => NgxMasonryComponent)) private parent: NgxMasonryComponent,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    if (this.parent.options.animations !== undefined) {
      this.animations = this.parent.options.animations;
    }
    if (this.parent.options.detectImageLoad === undefined) {
      this.parent.options.detectImageLoad = this.detectImageLoad;
    }
    this.renderer.setStyle(this.element.nativeElement, 'position', 'fixed');
    this.renderer.setStyle(this.element.nativeElement, 'right', '-150vw');
    this.parent.addPendingItem(this);
  }

  ngAfterViewInit() {
    // image lazyload or non-image support by selecting `itemSelector`
    // image support by default
    this.selectedElements = !this.parent.options.detectImageLoad
      ? (this.selectedElements = this.element.nativeElement.innerHTML)
      : Array.from(this.element.nativeElement.getElementsByTagName('img'));

    if (this.selectedElements.length === 0) {
      setTimeout(() => {
        this.parent.add(this);
      });
    } else {
      this.elements = new Set(this.selectedElements);

      for (const selectedElementRef of this.selectedElements) {
        if (!this.parent.options.detectImageLoad) {
          this.elementLoaded(selectedElementRef);
        } else {
          this.renderer.listen(selectedElementRef, 'load', (_) => {
            this.elementLoaded(selectedElementRef);
          });
          this.renderer.listen(selectedElementRef, 'error', (_) => {
            this.elementLoaded(selectedElementRef);
          });
        }
      }
    }
  }

  ngOnDestroy() {
    if (
      this.elements &&
      this.elements.size === 0 &&
      this.element.nativeElement.parentNode
    ) {
      this.playAnimation(false);
      this.parent.remove(this.element.nativeElement);
    }
  }

  private elementLoaded(item?: HTMLImageElement | HTMLElement) {
    this.elements.delete(item);
    if (this.elements.size === 0) {
      this.parent.add(this);
    }
  }

  public playAnimation(show: boolean) {
    const metadata = show ? this.animations.show : this.animations.hide;
    if (metadata) {
      const player = this.builder.build(metadata).create(this.element.nativeElement);
      player.play();
    }
  }
}
