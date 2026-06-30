import { IsString, MinLength,MaxLength, IsNumber,IsInt, Min, IsNotEmpty, IsOptional } from 'class-validator';
//Validatiopipe  hace que los campos sea siempre requeridos, por eso sin ! sale error
//Si queremos que sean opcionales, ponemos ? y necesitamos importar IsOptional
export class CreateProductInput {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @IsNotEmpty()
    name!:string;

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    price!:number;

    @IsInt()
    @Min(0)
    @IsNotEmpty()
    stock!:number;

    @IsOptional()
    @IsInt()
    categoryId?:number;
}