class Apifeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    /*
    this.query.sort(sortBy): This MongoDB method call (sort(sortBy)) does not modify the original this.query object. 
    Instead, it returns a new query object with the sorting applied.
    this.query = ...: By assigning this.query to this.query.sort(sortBy), you are updating this.
    query to point to the new query object returned by sort(sortBy).
    */
    filter(){
        let queryString = JSON.stringify(this.queryStr);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const parsedqueryString = JSON.parse(queryString);

        //here we are assigning the query result from sort to a query for further execution

        //LEFT HAND SIDE THIS
        //this.query
        //find returns a new query object with modificiations on the last query obj
        //so by using this we are updating query to the newest verion

        //Right hand side this
        //this.query.find(parsedqueryString) ensures you are invoking the .find() method 
        //on the query property of the current object instance (this).
        this.query = this.query.find(parsedqueryString);

        return this;        //return points to the current obj the current query object returned by filter
    }

    sort(){
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate(){
        const page = this.queryStr.page*1 || 1;
        const limit = this.queryStr.limit*1 || 10;
        const skip = (page -1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        // if(this.queryStr.page){
        //     const moviesCount = await Movie.countDocuments();
        //     if(skip >= moviesCount){
        //         throw new Error("This page is not found!");
        //     }
        // }

        return this;
    }
}

module.exports = Apifeatures;

/*
In Mongoose, a Query object represents a pending query. 
It allows you to build up a query with conditions, projections, sorting, etc., 
but it doesn't actually execute the query against the database immediately.
Model.find() returns a Query object that you can further chain methods on 
to modify the query parameters (like sort(), select(), limit(), etc.).
*/