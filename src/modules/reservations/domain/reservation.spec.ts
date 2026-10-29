import { PaymentStatus, Reservation, ReservationStatus } from './reservation';

function build(overrides = {}): Reservation {
  return new Reservation({
    id: 'r1',
    courtId: 'c1',
    startTime: new Date('2026-11-15T18:00:00-05:00'),
    endTime: new Date('2026-11-15T19:00:00-05:00'),
    totalAmount: 60000,
    ...overrides,
  });
}

describe('Reservation (dominio)', () => {
  it('rechaza fin anterior o igual al inicio', () => {
    expect(() =>
      new Reservation({
        id: 'r',
        courtId: 'c',
        startTime: new Date('2026-11-15T19:00:00-05:00'),
        endTime: new Date('2026-11-15T18:00:00-05:00'),
        totalAmount: 1,
      }),
    ).toThrow();
  });

  it('calcula la duración en horas', () => {
    expect(build().durationHours()).toBe(1);
  });

  it('verifica correctamente un código válido y confirma', () => {
    const r = build();
    const expires = new Date(Date.now() + 60000);
    r.setVerification('123456', expires);
    r.verify('123456');
    expect(r.status).toBe(ReservationStatus.CONFIRMED);
    expect(r.verifiedAt).not.toBeNull();
  });

  it('rechaza un código incorrecto', () => {
    const r = build();
    r.setVerification('123456', new Date(Date.now() + 60000));
    expect(() => r.verify('000000')).toThrow('Código de verificación incorrecto');
  });

  it('rechaza un código expirado', () => {
    const r = build();
    r.setVerification('123456', new Date(Date.now() - 1000));
    expect(() => r.verify('123456')).toThrow('expiró');
  });

  it('no permite cancelar una reserva completada', () => {
    const r = build({ status: ReservationStatus.COMPLETED });
    expect(() => r.cancel()).toThrow();
  });

  it('markPaid actualiza pago y confirma si estaba pendiente', () => {
    const r = build();
    r.markPaid('epayco', 'REF-1');
    expect(r.paymentStatus).toBe(PaymentStatus.PAID);
    expect(r.status).toBe(ReservationStatus.CONFIRMED);
    expect(r.paymentReference).toBe('REF-1');
  });
});
