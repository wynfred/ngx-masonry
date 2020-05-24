import { Directive, Inject, ElementRef, forwardRef, OnDestroy, AfterViewInit, Renderer2, OnInit, Input } from '@angular/core';
import { style, animate, AnimationBuilder } from '@angular/animations';

import { NgxMasonryComponent } from './ngx-masonry.component';
import { NgxMasonryAnimations } from './ngx-masonry-options';

@Directive({
  selector: '[ngxMasonryItem], ngxMasonryItem'
})
export class NgxMasonryDirective implements OnInit, OnDestroy, AfterViewInit {
  @Input() prepend = false;
  private images: Set<HTMLImageElement>;

  private animations: NgxMasonryAnimations = {
    show: [
      style({opacity: 0}),
      animate('400ms ease-in', style({opacity: 1})),
    ],
    hide: [
      style({opacity: '*'}),
      animate('400ms ease-in', style({opacity: 0})),
    ]
  }

  constructor(
    private builder: AnimationBuilder,
    private element: ElementRef,
    @Inject(forwardRef(() => NgxMasonryComponent)) private parent: NgxMasonryComponent,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    if (this.parent.options.animations !== undefined) {
      this.animations = this.parent.options.animations;
    }
  }

  ngAfterViewInit() {
    const images = this.element.nativeElement.getElementsByTagName('img');
    this.renderer.setStyle(this.element.nativeElement, 'opacity', '0');
    this.images = new Set(images);
    if (images.length === 0) {
      this.parent.add(this.element.nativeElement, this.prepend);
    } else {
      for (const imageRef of images) {
        this.renderer.listen(imageRef, 'load', _ => {
          this.imageLoaded(imageRef);
        });
        this.renderer.listen(imageRef, 'error', _ => {
          this.imageLoaded(imageRef);
        });
      }
    }
  }

  ngOnDestroy() {
    if (this.images.size === 0 && this.element.nativeElement.parentNode) {
      this.playAnimation(false);
      this.parent.remove(this.element.nativeElement);
    }
  }

  private imageLoaded(image?: HTMLImageElement) {
    this.images.delete(image);
    if (this.images.size === 0) {
      this.renderer.setStyle(this.element.nativeElement, 'opacity', '100');
      this.parent.add(this.element.nativeElement, this.prepend);
      this.playAnimation(true);
    }
  }

  private playAnimation(show: boolean) {
    const metadata = show ? this.animations.show : this.animations.hide;
    if (metadata) {
      const player = this.builder.build(metadata).create(this.element.nativeElement);
      player.play();
    }
  }
}
