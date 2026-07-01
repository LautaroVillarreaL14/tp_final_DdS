export type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    category?: {
        id: number;
        name: string;
    } | null;
};
export type CreateProductInput = {
    name: string;
    price: number;
    stock: number;
    category?: number;
};
export type UpdateProductInput = {
    name?: string;
    price?: number;
    stock?: number;
};
