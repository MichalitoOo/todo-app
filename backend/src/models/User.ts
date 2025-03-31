import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './Task';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: new Date() })
  createdAt!: Date;

  @OneToMany(() => Task, task => task.user)
  tasks!: Task[];

}
