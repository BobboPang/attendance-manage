import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    password: string

    @Column()
    class: string

    @Column()
    course: string

    @Column()
    code: string
}