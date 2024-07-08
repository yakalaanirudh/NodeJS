class Apifeatures{

    //const features=new Apifeatures(Movie.find(),req.body)
    //let movies=features.query
    
    //This returns a query object we assign taht query object to query
    //req.query is a query string we store in queryStr
    
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){
        let queryString = JSON.stringify(this.queryStr);    //here we are replacing req.query to queryStr
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryObj = JSON.parse(queryString);

        //to this query pass the query string which conatins the query parameters
        //the filtered data is assigned to this.query in lhs
        this.query = this.query.find(queryObj);

        return this;            //this is pointing to the current obj which can be used to next middleware enabling us chaining
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