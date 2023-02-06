import { QueryConfig } from "pg";
import { NextFunction, Request, Response } from "express";
import { client } from "./database";
import { IListRequiredtKeys, IRequestValidated, MovieResult } from "./interfaces";

export const validatedMovie = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const payload: any = request.body;
  const id: number = Number(request.params.id);

  if (id) {
    const queryString: string = `
      SELECT * FROM movies 
      WHERE id = $1
      `;
    const queryConfig: QueryConfig = {
      text: queryString,
      values: [id],
    };

    const queryResult: MovieResult = await client.query(queryConfig);
    const resultMovie: number = queryResult.rowCount;

    if (resultMovie === 0) {
      return response.status(404).json({ message: "Movie not found!" });
    }
  }

  if (payload.name) {
    const name = payload.name;
    const queryString: string = `
      SELECT * FROM movies 
      WHERE name = $1
      `;
    const queryConfig: QueryConfig = {
      text: queryString,
      values: [name],
    };

    const queryResult: MovieResult = await client.query(queryConfig);
    const resultMovie: number = queryResult.rowCount;

    if (resultMovie > 0) {
      return response.status(409).json({ message: "Movie already exists." });
    }
  }

  next();
};

export const validatedBodyData = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const payload: any = request.body;
  const keys: Array<string> = Object.keys(payload);
  const requiredListKey: Array<IListRequiredtKeys> = ["name", "price", "duration"];
  if (request.method === "POST") {
    const validatedKeys: boolean = requiredListKey.every((key: string) => keys.includes(key));

    if (!validatedKeys) {
      return response.status(404).json({ message: `Invalid input - expected ${requiredListKey}` });
    }
    if (
      typeof payload.name === "string" &&
      typeof payload.price === "number" &&
      typeof payload.duration === "number"
    ) {
      next();
    } else {
      return response.status(404).json({ message: `Invalid type input.` });
    }
  }

  if (request.method === "PATCH") {
    if (payload.name && typeof payload.name !== "string") {
      return response.status(404).json({ message: `Invalid type input.` });
    }
    if (payload.price && typeof payload.price !== "number") {
      return response.status(404).json({ message: `Invalid type input.` });
    }
    if (payload.duration && typeof payload.duration !== "number") {
      return response.status(404).json({ message: `Invalid type input.` });
    }
    next();
  }
};
