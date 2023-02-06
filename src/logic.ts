import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "./database";
import { MovieResult, IPagination } from "./interfaces";

export const addMovies = async (request: Request, response: Response): Promise<Response> => {
  const payload = request.body;

  try {
    const queryString: string = format(
      `
    INSERT INTO "movies"
    (%I)
        VALUES
    (%L)
        RETURNING *;
    `,
      Object.keys(payload),
      Object.values(payload)
    );

    const queryResult: MovieResult = await client.query(queryString);
    return response.status(201).json(queryResult.rows[0]);
  } catch (error) {
    return response.status(500).json("Internal server error!");
  }
};

export const listAllMovies = async (request: Request, response: Response): Promise<Response> => {
  let page = Number(request.query.page) || 1;
  let perPage = Number(request.query.perPage) || 5;
  const sort = request.query.sort;
  const order = request.query.order;

  if (typeof perPage !== "number" || perPage < 0) {
    perPage = 5;
  }

  if (typeof page !== "number" || page <= 0) {
    page = 1;
  }

  if (!sort || (sort !== "price" && sort !== "duration")) {
    const queryString: string = `
    SELECT * FROM movies
    OFFSET $1 LIMIT $2;
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [perPage * (page - 1), perPage],
    };

    const queryResult: MovieResult = await client.query(queryConfig);

    const baseUrl: string = "http://localhost:3000/movies";
    let prevPage: string | null = `${baseUrl}?page=${page > 1 ? page - 1 : 1}&perPage=${perPage}`;
    let nextPage: string | null = `${baseUrl}?page=${page + 1}&perPage=${perPage}`;
    if (page === 1) {
      prevPage = null;
    }

    const pagination: IPagination = {
      prevPage,
      nextPage,
      count: queryResult.rowCount,
      data: queryResult.rows.flat(),
    };

    return response.status(200).json(pagination);
  } else if (sort === "price" && (order === "ASC" || order !== "DESC")) {
    const queryString: string = `
    SELECT * FROM movies
    ORDER BY price ASC
    OFFSET $1 LIMIT $2
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [perPage * (page - 1), perPage],
    };
    const queryResult: MovieResult = await client.query(queryConfig);

    const baseUrl: string = "http://localhost:3000/movies";
    let prevPage: string | null = `${baseUrl}?page=${page > 1 ? page - 1 : 1}&perPage=${perPage}`;
    let nextPage: string | null = `${baseUrl}?page=${page + 1}&perPage=${perPage}`;
    if (page === 1) {
      prevPage = null;
    }
    const pagination: IPagination = {
      prevPage,
      nextPage,
      count: queryResult.rowCount,
      data: queryResult.rows.flat(),
    };
    return response.status(200).json(pagination);
  } else if (sort === "duration" && (order === "ASC" || order !== "DESC")) {
    const queryString: string = `
    SELECT * FROM movies
    ORDER BY duration ASC
    OFFSET $1 LIMIT $2
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [perPage * (page - 1), perPage],
    };
    const queryResult: MovieResult = await client.query(queryConfig);

    const baseUrl: string = "http://localhost:3000/movies";
    let prevPage: string | null = `${baseUrl}?page=${page > 1 ? page - 1 : 1}&perPage=${perPage}`;
    let nextPage: string | null = `${baseUrl}?page=${page + 1}&perPage=${perPage}`;
    if (page === 1) {
      prevPage = null;
    }
    const pagination: IPagination = {
      prevPage,
      nextPage,
      count: queryResult.rowCount,
      data: queryResult.rows.flat(),
    };
    return response.status(200).json(pagination);
  } else if (sort === "price" && order === "DESC") {
    const queryString: string = `
    SELECT * FROM movies
    ORDER BY price DESC
    OFFSET $1 LIMIT $2;
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [perPage * (page - 1), perPage],
    };
    const queryResult: MovieResult = await client.query(queryConfig);

    const baseUrl: string = "http://localhost:3000/movies";
    let prevPage: string | null = `${baseUrl}?page=${page > 1 ? page - 1 : 1}&perPage=${perPage}`;
    let nextPage: string | null = `${baseUrl}?page=${page + 1}&perPage=${perPage}`;
    if (page === 1) {
      prevPage = null;
    }
    const pagination: IPagination = {
      prevPage,
      nextPage,
      count: queryResult.rowCount,
      data: queryResult.rows.flat(),
    };

    return response.status(200).json(pagination);
  } else {
    const queryString: string = `
    SELECT * FROM movies
    ORDER BY duration DESC
    OFFSET $1 LIMIT $2;
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [perPage * (page - 1), perPage],
    };
    const queryResult: MovieResult = await client.query(queryConfig);

    const baseUrl: string = "http://localhost:3000/movies";
    let prevPage: string | null = `${baseUrl}?page=${page > 1 ? page - 1 : 1}&perPage=${perPage}`;
    let nextPage: string | null = `${baseUrl}?page=${page + 1}&perPage=${perPage}`;
    if (page === 1) {
      prevPage = null;
    }
    const pagination: IPagination = {
      prevPage,
      nextPage,
      count: queryResult.rowCount,
      data: queryResult.rows.flat(),
    };

    return response.status(200).json(pagination);
  }
};

export const updateMovie = async (request: Request, response: Response): Promise<Response> => {
  const keysMovie: string[] = Object.keys(request.body);
  const valuesMovie: string[] = Object.values(request.body);
  const id: number = Number(request.params.id);

  if (request.body.id) {
    return response.status(400).json({
      message: "Erro updating id",
    });
  }

  try {
    const queryString: string = format(
      `
    UPDATE movies SET (%I) = ROW(%L)
    WHERE id = $1
    RETURNING *;
    `,
      keysMovie,
      valuesMovie
    );

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [id],
    };

    const queryResult: MovieResult = await client.query(queryConfig);

    return response.json(queryResult.rows[0]);
  } catch (error) {
    return response.status(500).json("Internal server error!");
  }
};

export const deleteMovie = async (request: Request, response: Response): Promise<Response> => {
  const id: number = Number(request.params.id);

  const queryString: string = `
    DELETE FROM movies
    WHERE id = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return response.status(204).send();
};
