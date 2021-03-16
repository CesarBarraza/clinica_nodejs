import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@Entity()
@Unique(['dni'])
export class Paciente {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    nombre: string;

    @Column()
    @IsNotEmpty()
    apellido: string;

    @Column()
    @IsNotEmpty()
    @MaxLength(8)
    dni: number;

    @Column()
    @IsNotEmpty()
    fechaDeNacimiento: Date;

    @Column()
    @IsNotEmpty()
    direccion: string;

    @Column()
    @IsNotEmpty()
    localidad: string;

    @Column()
    @IsNotEmpty()
    telefono: string;
}