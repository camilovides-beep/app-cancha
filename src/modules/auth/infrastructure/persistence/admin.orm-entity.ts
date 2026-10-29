import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Mapeo de persistencia de la tabla `admins`. Vive en infraestructura. */
@Entity({ name: 'admins' })
export class AdminOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ default: 'admin' })
  role!: string;

  @Column({ default: true })
  active!: boolean;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin!: Date | null;
}
