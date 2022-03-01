exports.evaluationAverage = (allInteractionsByMovie) => {
  const sumOfRating = allInteractionsByMovie?.reduce(
    (previousMovie, currentMovie) => previousMovie + currentMovie.rate,
    0
  );
  const total_interactions = allInteractionsByMovie?.length;
  return Number((sumOfRating / total_interactions).toFixed(1));
};
