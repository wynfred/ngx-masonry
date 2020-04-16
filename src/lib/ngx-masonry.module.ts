import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMasonryComponent } from './ngx-masonry.component';
import { NgxMasonryDirective } from './ngx-masonry.directive';

@NgModule({
  imports: [],
  declarations: [NgxMasonryComponent, NgxMasonryDirective],
  exports: [NgxMasonryComponent, NgxMasonryDirective]
})
export class NgxMasonryModule {}
