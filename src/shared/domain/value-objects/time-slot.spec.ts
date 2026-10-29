import { TimeSlot, timeSlotFromHour } from './time-slot';

describe('timeSlotFromHour', () => {
  it.each([
    [6, TimeSlot.DAY],
    [11, TimeSlot.DAY],
    [12, TimeSlot.AFTERNOON],
    [17, TimeSlot.AFTERNOON],
    [18, TimeSlot.NIGHT],
    [23, TimeSlot.NIGHT],
    [0, TimeSlot.NIGHT],
    [5, TimeSlot.NIGHT],
  ])('hora %i → %s', (hour, expected) => {
    expect(timeSlotFromHour(hour)).toBe(expected);
  });

  it('rechaza horas inválidas', () => {
    expect(() => timeSlotFromHour(24)).toThrow();
    expect(() => timeSlotFromHour(-1)).toThrow();
  });
});
