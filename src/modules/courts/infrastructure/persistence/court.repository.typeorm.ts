import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from '../../../../shared/domain/value-objects/time-slot';
import { UserCategory } from '../../../../shared/domain/value-objects/user-category';
import { Court, RateMatrix } from '../../domain/court';
import { CourtRepository } from '../../domain/court.repository';
import { CourtOrmEntity } from './court.orm-entity';

@Injectable()
export class TypeOrmCourtRepository implements CourtRepository {
  constructor(
    @InjectRepository(CourtOrmEntity)
    private readonly repo: Repository<CourtOrmEntity>,
  ) {}

  async findAll(): Promise<Court[]> {
    const rows = await this.repo.find({ order: { name: 'ASC' } });
    return rows.map((r) => this.toDomain(r));
  }

  async findActive(): Promise<Court[]> {
    const rows = await this.repo.find({ where: { status: 'active' }, order: { name: 'ASC' } });
    return rows.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Court | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async create(court: Court): Promise<Court> {
    const row = this.repo.create(this.toOrm(court));
    const saved = await this.repo.save(row);
    return this.toDomain(saved);
  }

  async update(court: Court): Promise<Court> {
    await this.repo.update(court.id, this.toOrm(court));
    const saved = await this.repo.findOneOrFail({ where: { id: court.id } });
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(r: CourtOrmEntity): Court {
    const rates: RateMatrix = {
      [UserCategory.A]: {
        [TimeSlot.DAY]: r.categoryADayRate,
        [TimeSlot.AFTERNOON]: r.categoryAAfternoonRate,
        [TimeSlot.NIGHT]: r.categoryANightRate,
      },
      [UserCategory.B]: {
        [TimeSlot.DAY]: r.categoryBDayRate,
        [TimeSlot.AFTERNOON]: r.categoryBAfternoonRate,
        [TimeSlot.NIGHT]: r.categoryBNightRate,
      },
      [UserCategory.C]: {
        [TimeSlot.DAY]: r.categoryCDayRate,
        [TimeSlot.AFTERNOON]: r.categoryCAfternoonRate,
        [TimeSlot.NIGHT]: r.categoryCNightRate,
      },
      [UserCategory.D]: {
        [TimeSlot.DAY]: r.categoryDDayRate,
        [TimeSlot.AFTERNOON]: r.categoryDAfternoonRate,
        [TimeSlot.NIGHT]: r.categoryDNightRate,
      },
    };
    return new Court({
      id: r.id,
      name: r.name,
      sportType: r.sportType,
      status: r.status,
      location: r.location,
      courtType: r.courtType,
      venueName: r.venueName,
      description: r.description,
      address: r.address,
      additionalInfo: r.additionalInfo,
      images: r.images ?? [],
      attributes: r.attributes ?? [],
      venueServices: r.venueServices ?? [],
      map: { lat: r.mapLat, lng: r.mapLng, address: r.mapAddress },
      hourlyRate: r.hourlyRate,
      dayRate: r.dayRate,
      afternoonRate: r.afternoonRate,
      nightRate: r.nightRate,
      rates,
      createdAt: r.createdAt,
    });
  }

  private toOrm(c: Court): Partial<CourtOrmEntity> {
    return {
      id: c.id,
      name: c.name,
      sportType: c.sportType,
      status: c.status,
      location: c.location,
      courtType: c.courtType,
      venueName: c.venueName,
      description: c.description,
      address: c.address,
      additionalInfo: c.additionalInfo,
      images: c.images,
      attributes: c.attributes,
      venueServices: c.venueServices,
      mapLat: c.map.lat,
      mapLng: c.map.lng,
      mapAddress: c.map.address,
      hourlyRate: c.hourlyRate,
      dayRate: c.dayRate,
      afternoonRate: c.afternoonRate,
      nightRate: c.nightRate,
      categoryADayRate: c.rates.A.day,
      categoryAAfternoonRate: c.rates.A.afternoon,
      categoryANightRate: c.rates.A.night,
      categoryBDayRate: c.rates.B.day,
      categoryBAfternoonRate: c.rates.B.afternoon,
      categoryBNightRate: c.rates.B.night,
      categoryCDayRate: c.rates.C.day,
      categoryCAfternoonRate: c.rates.C.afternoon,
      categoryCNightRate: c.rates.C.night,
      categoryDDayRate: c.rates.D.day,
      categoryDAfternoonRate: c.rates.D.afternoon,
      categoryDNightRate: c.rates.D.night,
    };
  }
}
