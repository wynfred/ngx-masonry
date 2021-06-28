import { Directive, Inject, ElementRef, forwardRef, OnDestroy, AfterViewInit, Renderer2, OnInit, Input } from '@angular/core';
import { style, animate, AnimationBuilder } from '@angular/animations';

import { NgxMasonryComponent } from './ngx-masonry.component';
import { NgxMasonryAnimations } from './ngx-masonry-options';

@Directive({
  selector: '[ngxMasonryItem], ngxMasonryItem'
})
export class NgxMasonryDirective implements OnInit, OnDestroy, AfterViewInit {
  @Input() prepend = false;
  @Input() ready = false;

  public images: Set<HTMLImageElement>;
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
    this.renderer.setStyle(this.element.nativeElement, 'position', 'fixed');
    this.renderer.setStyle(this.element.nativeElement, 'right', '-150vw');

    if (!this.ready) {
      this.parent.addPendingItem(this);
    }
  }

  ngAfterViewInit() {
    if (!this.ready) {
      const images: HTMLImageElement[] = Array.from(this.element.nativeElement.getElementsByTagName('img'));
      this.images = new Set(images);
      if (images.length === 0) {
        setTimeout(() => {
          this.parent.add(this);
        });
      } else {
        for (const imageRef of images) {
          // skip image render check if image has `masonryLazy` attribute
          if (imageRef.hasAttribute('masonryLazy')) {
              this.imageLoaded(imageRef);
          } else { 
            this.renderer.listen(imageRef, 'load', _ => {
              this.imageLoaded(imageRef);
            });
            this.renderer.listen(imageRef, 'error', _ => {
              this.imageLoaded(imageRef);
            });
          }
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.images && this.images.size === 0 && this.element.nativeElement.parentNode) {
      this.playAnimation(false);
      this.parent.remove(this.element.nativeElement);
    }
  }

  private imageLoaded(image?: HTMLImageElement) {
    this.images.delete(image);
    if (this.images.size === 0) {
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
