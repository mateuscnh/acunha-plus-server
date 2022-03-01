const express = require("express");
const routes = express.Router();

const UserController = require("./controllers/UserController");
const MovieController = require("./controllers/MovieController");
const GenresController = require("./controllers/GenresController");
const InteractionController = require("./controllers/InteractionController");
const RecommendationsController = require("./controllers/RecommendationsController");

routes
  // users
  .get("/users", UserController.index)
  .post("/users", UserController.create)
  // movies
  .get("/movies", MovieController.moviesByGenre)
  .get("/movies/:id", MovieController.movieById)
  .post("/movies", MovieController.create)
  // genres
  .get("/genres", GenresController.index)
  .post("/genres", GenresController.create)
  // interactions
  .get("/interactions", InteractionController.index)
  .get("/interactions/:user_id", InteractionController.indexByUser)
  .post("/interactions", InteractionController.create)
  .put("/interactions/:id", InteractionController.update)
  .delete("/interactions/:id", InteractionController.delete)
  // recommendations
  .get("/recommendations", RecommendationsController.index)
  .get(
    "/recommendations/interactions",
    RecommendationsController.indexInteractions
  )
  .get(
    "/recommendations/interactions/:user_id",
    RecommendationsController.indexInteractionsByUser
  )
  .post("/recommendations/interactions", RecommendationsController.create)
  .put("/recommendations/interactions/:id", RecommendationsController.update);

module.exports = routes;
