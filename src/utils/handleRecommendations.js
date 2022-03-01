const interactionsGroupedByUser = (data) =>
  data?.reduce((oldInteractions, currentInteractions) => {
    const { id, name, rate, movie_id } = currentInteractions;
    const hasUser = oldInteractions?.find((old) => old.id === id);
    if (hasUser) {
      oldInteractions = oldInteractions.map((old) => {
        if (old.id === id) {
          return {
            ...old,
            interactions: [...old.interactions, { rate, movie_id }],
          };
        }
        return old;
      });
    } else {
      oldInteractions.push({
        id,
        name,
        interactions: [{ rate, movie_id }],
      });
    }
    return oldInteractions;
    // [
    // 	{
    // 		"id": 1,
    // 		"name": "Mateus",
    // 		"interactions": [
    // 			{
    // 				"rate": 5,
    // 				"movie_id": 1
    // 			},
    //     ]
    //   },
    // ]
  }, []);

const pearson = (x, y) => {
  const n = x.length;
  const idx = Array.from({ length: n }, (x, i) => i);

  // Averages
  const avgX = x.reduce((a, b) => a + b) / n;
  const avgY = y.reduce((a, b) => a + b) / n;

  const numMult = idx.map((i) => (x[i] - avgX) * (y[i] - avgY));
  const numerator = numMult.reduce((a, b) => a + b);

  const denomX = idx
    .map((i) => Math.pow(x[i] - avgX, 2))
    .reduce((a, b) => a + b);
  const denomY = idx
    .map((i) => Math.pow(y[i] - avgY, 2))
    .reduce((a, b) => a + b);
  const denominator = Math.sqrt(denomX * denomY);

  return numerator / denominator;
};

module.exports = { interactionsGroupedByUser, pearson };
