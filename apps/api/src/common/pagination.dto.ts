import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 25;

  @IsOptional()
  @IsString()
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  return {
    data,
    total,
    page,
    limit,
    pageCount: Math.ceil(total / limit),
  };
}
