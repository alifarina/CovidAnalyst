import { trigger, transition, animate, style } from '@angular/animations'

export const SlideInOutAnimation = [
  trigger('slideInOut', [
    transition(':enter', [
      style({ transform: 'translateX(-15%)', opacity:0 }),
      animate('1000ms ease-in', style({ transform: 'translateY(0%)', opacity:1 })),
    ]),
    transition(':leave', [
      animate('1000ms ease-in', style({ transform: 'translateX(-15%)', opacity:0 })),
    ]),
  ]),
];
