const { pearson } = require("./handleRecommendations");

const collaborativeFiltering = (userLogged, otherUsers) => {
  const handleUserLogged = () => {
    const newArrayUser = {
      id: userLogged.id,
      name: userLogged.name,
    };
    userLogged?.interactions?.forEach((movie) => {
      newArrayUser[`movie-${movie.movie_id}`] = movie.rate;
    });
    return newArrayUser;
  };

  const userLoggedRate = Object.values(handleUserLogged()).slice(2);

  const intersectionAttr = (objUser) => {
    const userLoggedKeys = Object.keys(handleUserLogged());
    const otherUser = {};

    userLoggedKeys.forEach((key) => {
      otherUser[key] = objUser[key] ?? 0;
    });
    return otherUser;
  };

  const formattedUsers = () =>
    otherUsers.map((user) => {
      const newArrayUser = {
        id: user.id,
        name: user.name,
      };
      user.interactions.forEach((movie) => {
        newArrayUser[`movie-${movie.movie_id}`] = movie.rate;
      });

      return newArrayUser;
    }, []);

  const handleMatrixOfUsersAndItems = () => {
    const matrix = [];
    formattedUsers().forEach((user) => {
      matrix.push(intersectionAttr(user));
    }, []);
    return matrix;
  };

  const matrixUsersAndItems = handleMatrixOfUsersAndItems();

  const handleSimilarUser = () => {
    const rates = [];
    matrixUsersAndItems.forEach((user) => {
      const userRate = Object.values(user).slice(2);
      rates.push(pearson(userLoggedRate, userRate));
    });

    const userWithPearson = rates.map((pearsonNumber, index) => ({
      ...formattedUsers()[index],
      pearsonNumber,
    }));
    userWithPearson.sort((a, b) => {
      if (a.pearsonNumber > b.pearsonNumber) {
        return -1;
      }
      if (a.pearsonNumber < b.pearsonNumber) {
        return 1;
      }
      return 0;
    });

    return userWithPearson;
  };

  const handleRecommendedMovies = () => {
    const userLoggedKeys = Object.keys(handleUserLogged()).slice(2);

    const unwatchedMovies = handleSimilarUser()
      .map((user) => {
        const userMovies = Object.keys(user).slice(2);
        userMovies.pop();
        return userMovies?.filter((key) => userLoggedKeys.indexOf(key) === -1);
      })
      ?.join()
      .split(",");

    const treatedUnwatchedMovies = [...new Set(unwatchedMovies)]?.filter(
      (n) => n
    );

    const recommendedMovies = [];
    treatedUnwatchedMovies.map((movieKey) => {
      const movieId = Number(movieKey.split("-")[1]);
      recommendedMovies.push(movieId);
    });

    return recommendedMovies;
  };

  return handleRecommendedMovies();
};

module.exports = { collaborativeFiltering };
