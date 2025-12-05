import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export interface IResponse<T> {
  data?: T;
  message?: string;
  statusCode?: number;
  error?: string;
}

export class RouteIdsParamsDto {
  @Transform(({ value }) =>
    value !== null && value !== undefined && value !== ''
      ? Number(value)
      : undefined
  )
  @IsOptional()
  id: string;
}