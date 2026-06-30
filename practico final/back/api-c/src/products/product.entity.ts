import { Entity,Column, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    name!:string;

    @Column()
    price!:number;

    @Column()
    stock!: number;

    @Column({ default: 1 })
    categoryId!: number;
}