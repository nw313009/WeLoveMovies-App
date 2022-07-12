const service = require("../movies/movies-service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: `Movie cannot be found: ${movieId}.` });
}

function read(req, res){
  const { movie } = res.locals;
  res.json({data: movie});
}

async function readReviews(req, res){
  const { movie } = res.locals;
  const data = await service.readReviews(movie);
  res.json({data: data})
}

async function readTheaters(req, res){
  const { movie } = res.locals;
  const data = await service.readTheaters(movie);
  res.json({data: data}) 
}

async function list(req, res) {
  const { is_showing } = req.query;
  if (!is_showing) {
    const data = await service.list();
    res.json({
      data,
    });
  } else {
    const showingData = await service.listShowing();
    res.json({
      data: showingData,
    });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  readReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readReviews)],
  readTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readTheaters)],
};