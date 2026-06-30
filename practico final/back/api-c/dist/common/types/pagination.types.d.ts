export interface PaginationQuery {
    page: number;
    limit: number;
}
export interface PaginationResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
