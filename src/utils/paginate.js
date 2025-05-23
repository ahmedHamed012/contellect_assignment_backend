/**
 * Reusable pagination helper for Mongoose models
 *
 * @param {Model} model - Mongoose model
 * @param {Object} query - Mongoose query filter (e.g., { name: /ahmed/i })
 * @param {Object} options - Pagination options: page, limit, sort
 * @returns {Object} Paginated result
 */
const paginate = async (model, query = {}, options = {}) => {
  const minPaginatedItems = 5;
  const page = Math.max(parseInt(options.page) || 1, 1);
  const limit = Math.max(parseInt(options.limit) || minPaginatedItems, 1);
  const skip = (page - 1) * limit;

  const [results, total] = await Promise.all([
    model
      .find(query)
      .sort(options.sort || {})
      .skip(skip)
      .limit(limit),
    model.countDocuments(query),
  ]);

  return {
    total,
    page,
    pageSize: results.length,
    totalPages: Math.ceil(total / limit),
    data: results,
  };
};

module.exports = paginate;
