import { IsString, MinLength,MaxLength, IsNumber,IsInt, Min, IsOptional } from 'class-validator';

export class UpdateProductInput {
    @IsString()
        @MinLength(2)
        @MaxLength(100)
        @IsOptional()
        name?:string;
    
        @IsNumber()
        @Min(1)
        @IsOptional()
        price?:number;
    
        @IsInt()
        @Min(0)
        @IsOptional()
        stock?:number;
}