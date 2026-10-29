import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column() name!: string;
  @Column({ unique: true }) email!: string;
  @Column({ type: 'varchar', nullable: true }) phone!: string | null;
  @Column({ default: 'customer' }) role!: string;
  @Column({ name: 'password_hash', type: 'text', nullable: true }) passwordHash!: string | null;
  @Column({ default: 'D' }) category!: string;
  @Column({ name: 'document_number', type: 'varchar', nullable: true }) documentNumber!: string | null;
  @Column({ name: 'document_type', type: 'varchar', default: 'CC' }) documentType!: string | null;
  @Column({ default: 'active' }) status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}
