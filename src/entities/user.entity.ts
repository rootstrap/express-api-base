import { Entity, Column, BeforeInsert } from 'typeorm';
import { IsEmail, validateOrReject, IsNotEmpty, IsString } from 'class-validator';
import { Base } from './base.entity';

@Entity()
export class User extends Base {
  @BeforeInsert()
  async beforeInsert() {
    await validateOrReject(this);
  }

  @Column({ nullable: true })
  @IsString()
  firstName?: string;

  @Column({ nullable: true })
  @IsString()
  lastName?: string;

  @Column()
  @IsEmail()
  email!: string;

  @Column()
  @IsNotEmpty()
  password!: string;
}
