import { QueryResult } from "pg";

export interface IMovie {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export type MovieAdd = Omit<IMovie, "id">;

export type MovieResult = QueryResult<IMovie>;

export type IListRequiredtKeys = "name" | "description" | "duration" | "price";

export interface IPagination {
  prevPage: string | null;
  nextPage: string | null;
  count: number;
  data: IMovie[];
}

export interface IRequestValidated {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
}
