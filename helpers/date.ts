import { Duration } from 'date-fns';
import { DurationUnit } from 'date-fns/types';

/**
 * @description convert Duration object in simple string
 * @example
 * formattedDuration({months: 1,days: 1}); // '1m 1d'
 * formattedDuration({hours: 1}); // '1h 1m'
 * formattedDuration({}); // '0s'
 */
export const formattedDuration = (duration?: Duration) => {
  const keys = duration ? (Object.keys(duration) as DurationUnit[]) : [];

  // check is duration empty or duration has  only seconds
  if (keys.length === 0 || !duration) return '0s';

  if (keys.length === 1 && 'seconds' in duration) return `${duration.seconds}s`;

  const measurementUnit = {
    years: 'y',
    months: 'm',
    weeks: 'w',
    days: 'd',
    hours: 'h',
    minutes: 'min',
    seconds: 's',
  };
  const measurementUnitKeys = Object.keys(measurementUnit) as DurationUnit[];

  const firstKey = keys[0];
  const secondKey = keys[1];

  const firstPart = `${duration[firstKey]}${measurementUnit[firstKey]}`;

  if (secondKey) {
    return `${firstPart} ${duration[secondKey]}${measurementUnit[secondKey]}`;
  } else {
    const firstKeyIndex = measurementUnitKeys.findIndex(value => value === firstKey);
    const secondKey = measurementUnitKeys[firstKeyIndex + 1] ?? measurementUnitKeys[measurementUnitKeys.length - 1];

    return `${firstPart} 0${measurementUnit[secondKey]}`;
  }
};
