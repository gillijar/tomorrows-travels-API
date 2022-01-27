class ControllerFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["sort"];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-ratingsAverage");
    }

    console.log(this.queryString);

    return this;
  }

  limit() {
    if (this.queryString.limit) {
      const limit = this.queryString.limit * 1;
      this.query = this.query.limit(limit);
    }

    return this;
  }
}

module.exports = ControllerFeatures;
