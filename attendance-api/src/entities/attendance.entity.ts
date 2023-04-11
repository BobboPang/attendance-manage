import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentCode: string;

  @Column()
  studentName: string;

  @Column()
  studentId: string;

  @Column()
  teacherName: string;

  @Column()
  courseId: string;

  @Column()
  courseName: string;

  @Column()
  time: string;

  @Column()
  latitude: string;

  @Column()
  longtitude: string;

  @Column()
  address: string;
}
