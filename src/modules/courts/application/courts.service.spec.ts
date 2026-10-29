import { EntityNotFoundException } from '../../../shared/domain/exceptions/domain.exception';
import { Court } from '../domain/court';
import { CourtRepository } from '../domain/court.repository';
import { CourtsService } from './courts.service';

describe('CourtsService', () => {
  const repo: jest.Mocked<CourtRepository> = {
    findAll: jest.fn(),
    findActive: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  let service: CourtsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CourtsService(repo);
  });

  it('lanza EntityNotFound cuando la cancha no existe', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(service.findById('nope')).rejects.toBeInstanceOf(EntityNotFoundException);
  });

  it('crea una cancha con estado activo por defecto y matriz de tarifas', async () => {
    repo.create.mockImplementation(async (c) => c);
    const court = await service.create({
      name: 'Nueva',
      sportType: 'Fútbol',
      rates: { A: { night: 65000 } },
    });
    expect(court).toBeInstanceOf(Court);
    expect(court.status).toBe('active');
    expect(court.rates.A.night).toBe(65000);
    expect(repo.create).toHaveBeenCalled();
  });

  it('actualiza solo los campos provistos', async () => {
    const existing = new Court({ id: 'c1', name: 'Vieja', sportType: 'Fútbol', status: 'active' });
    repo.findById.mockResolvedValue(existing);
    repo.update.mockImplementation(async (c) => c);

    const updated = await service.update('c1', { name: 'Renombrada' });
    expect(updated.name).toBe('Renombrada');
    expect(updated.sportType).toBe('Fútbol');
  });
});
