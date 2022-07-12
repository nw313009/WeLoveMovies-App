const service = require("../reviews/reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
    const { reviewId } = req.params;
    const review = await service.read(reviewId);
    if (review) {
      res.locals.review = review;
      return next();
    }
    return next({ status: 404, message: `Review cannot be found: ${reviewId}.` });
}

async function update(req, res){
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id,
    };
    await service.update(updatedReview);
    const data = await service.readCritic(updatedReview.review_id);
    res.json({ data }); 
}

async function destroy(req, res){
    const { review } = res.locals;
    await service.delete(review.review_id);
    res.sendStatus(204);
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    destroy: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
}