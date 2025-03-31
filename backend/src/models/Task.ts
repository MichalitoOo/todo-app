import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
    HIGH = 1,
    MEDIUM = 2,
    LOW = 3,
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ nullable: true }) // allows null values in database
    description?: string;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
    status!: TaskStatus;

    @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
    priority!: TaskPriority;

    @ManyToOne(() => User, user => user.tasks)
    user!: User;

    @CreateDateColumn( { default: new Date() })
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date; 

}