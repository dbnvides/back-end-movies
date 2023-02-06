import express, { Application } from "express";
import { startDatabase } from "./database";
import { addMovies, deleteMovie, listAllMovies, updateMovie } from "./logic";
import { validatedBodyData, validatedMovie } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/movies", validatedMovie, validatedBodyData, addMovies);
app.get("/movies", listAllMovies);
app.patch("/movies/:id", validatedMovie, validatedBodyData, updateMovie);
app.delete("/movies/:id", validatedMovie, deleteMovie);

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server is running!");
});
