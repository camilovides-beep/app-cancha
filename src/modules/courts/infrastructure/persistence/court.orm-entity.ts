import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { numericTransformer } from '../../../../shared/infrastructure/database/numeric.transformer';

const num = { type: 'numeric', nullable: true, transformer: numericTransformer } as const;

@Entity({ name: 'courts' })
export class CourtOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column() name!: string;
  @Column({ name: 'sport_type' }) sportType!: string;
  @Column({ default: 'active' }) status!: string;

  @Column({ type: 'varchar', nullable: true }) location!: string | null;
  @Column({ name: 'court_type', type: 'varchar', nullable: true }) courtType!: string | null;
  @Column({ name: 'venue_name', type: 'varchar', nullable: true }) venueName!: string | null;
  @Column({ type: 'text', nullable: true }) description!: string | null;
  @Column({ type: 'text', nullable: true }) address!: string | null;
  @Column({ name: 'additional_info', type: 'text', nullable: true }) additionalInfo!: string | null;

  @Column({ type: 'jsonb', default: () => "'[]'" }) images!: string[];
  @Column({ type: 'jsonb', default: () => "'[]'" }) attributes!: string[];
  @Column({ name: 'venue_services', type: 'jsonb', default: () => "'[]'" }) venueServices!: string[];

  @Column({ name: 'map_lat', ...num }) mapLat!: number | null;
  @Column({ name: 'map_lng', ...num }) mapLng!: number | null;
  @Column({ name: 'map_address', type: 'text', nullable: true }) mapAddress!: string | null;

  @Column({ name: 'hourly_rate', type: 'numeric', default: 0, transformer: numericTransformer })
  hourlyRate!: number;

  @Column({ name: 'day_rate', ...num }) dayRate!: number | null;
  @Column({ name: 'afternoon_rate', ...num }) afternoonRate!: number | null;
  @Column({ name: 'night_rate', ...num }) nightRate!: number | null;

  @Column({ name: 'category_a_day_rate', ...num }) categoryADayRate!: number | null;
  @Column({ name: 'category_a_afternoon_rate', ...num }) categoryAAfternoonRate!: number | null;
  @Column({ name: 'category_a_night_rate', ...num }) categoryANightRate!: number | null;
  @Column({ name: 'category_b_day_rate', ...num }) categoryBDayRate!: number | null;
  @Column({ name: 'category_b_afternoon_rate', ...num }) categoryBAfternoonRate!: number | null;
  @Column({ name: 'category_b_night_rate', ...num }) categoryBNightRate!: number | null;
  @Column({ name: 'category_c_day_rate', ...num }) categoryCDayRate!: number | null;
  @Column({ name: 'category_c_afternoon_rate', ...num }) categoryCAfternoonRate!: number | null;
  @Column({ name: 'category_c_night_rate', ...num }) categoryCNightRate!: number | null;
  @Column({ name: 'category_d_day_rate', ...num }) categoryDDayRate!: number | null;
  @Column({ name: 'category_d_afternoon_rate', ...num }) categoryDAfternoonRate!: number | null;
  @Column({ name: 'category_d_night_rate', ...num }) categoryDNightRate!: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
