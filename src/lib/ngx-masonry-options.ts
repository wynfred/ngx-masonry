import { AnimationMetadata } from '@angular/animations';

export interface NgxMasonryOptions {
  itemSelector?: string;
  columnWidth?: number | string;
  gutter?: number | string;
  percentPosition?: boolean;
  stamp?: string;
  fitWidth?: boolean;
  originLeft?: boolean;
  originTop?: boolean;
  containerStyle?: string;
  resize?: boolean;
  initLayout?: boolean;
  horizontalOrder?: boolean;
  animations?: NgxMasonryAnimations;
}

export interface NgxMasonryAnimations {
  show?: AnimationMetadata[];
  hide?: AnimationMetadata[];
}
