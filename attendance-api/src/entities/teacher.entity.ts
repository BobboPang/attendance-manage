import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    password: string

    @Column()
    class: JSON

    @Column()
    course: JSON

    @Column()
    code: string
}