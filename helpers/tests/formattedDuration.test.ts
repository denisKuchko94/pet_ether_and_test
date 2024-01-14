// const { NumberFormatter } = require('../numberFormatter');

import { formattedDuration } from '../date';

test('check convertation of period into readable string', () => {
  expect(formattedDuration({ months: 1, days: 1, hours: 1, minutes: 1, seconds: 1 })).toBe('1m 1d');
  expect(formattedDuration({ days: 1, hours: 1, minutes: 1, seconds: 1 })).toBe('1d 1h');
  expect(formattedDuration({ hours: 1, minutes: 1, seconds: 1 })).toBe('1h 1min');
  expect(formattedDuration({ minutes: 1, seconds: 1 })).toBe('1min 1s');
  expect(formattedDuration({ months: 1, hours: 1 })).toBe('1m 1h');
  expect(formattedDuration({ minutes: 1 })).toBe('1min 0s');
  expect(formattedDuration({ months: 1 })).toBe('1m 0w');
  expect(formattedDuration({ years: 1 })).toBe('1y 0m');
  expect(formattedDuration({ seconds: 1 })).toBe('1s');
  expect(formattedDuration({ seconds: 0 })).toBe('0s');
  expect(formattedDuration({ seconds: 1 })).toBe('1s');
  expect(formattedDuration({})).toBe('0s');
  expect(formattedDuration()).toBe('0s');
});
