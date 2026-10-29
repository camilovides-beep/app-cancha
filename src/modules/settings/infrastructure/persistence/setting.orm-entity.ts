import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'settings' })
export class SettingOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'setting_key', unique: true })
  key!: string;

  @Column({ name: 'setting_value', type: 'text', nullable: true })
  value!: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
