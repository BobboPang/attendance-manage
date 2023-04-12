import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    student: string

    @Column()
    teacher: string
}