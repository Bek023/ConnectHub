import { animate, group, query, style, transition, trigger } from '@angular/animations';

const EASE = 'linear';

export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    query(':enter', [style({ opacity: 0, transform: 'translateY(12px)' })], { optional: true }),
    group([
      query(
        ':leave',
        [animate(`180ms ${EASE}`, style({ opacity: 0, transform: 'translateY(-8px)' }))],
        { optional: true },
      ),
      query(
        ':enter',
        [animate(`320ms 80ms ${EASE}`, style({ opacity: 1, transform: 'translateY(0)' }))],
        { optional: true },
      ),
    ]),
  ]),
]);

export const listStagger = trigger('listStagger', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-6px)' }),
    animate(`260ms ${EASE}`, style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
]);
