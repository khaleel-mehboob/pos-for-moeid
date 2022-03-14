class APIFeatures {
  constructor(query, queryString){
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = {...this.queryString};
    const excludedFields = ['page', 'offset', 'fields', 'limit', 'sort', 'attributes'];
    excludedFields.forEach(el => delete queryObj[el]);
    
    this.query.where = {};

    return this;
  }

  sort() {
    if(this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',');

      let orderBy = [];
      orderBy = sortBy.map(el => {
        if(el.startsWith('-')) {
          return [el.substring(1, el.length), 'DESC'];
        } 
        else
        {
          return [el, 'ASC']
        }
      });

      this.query.order = orderBy;
    } else {
      this.query.order = [['id', 'ASC']];
    }

    return this;
  }

  limitFields() {
    if(this.queryString.attributes) {
      this.query.attributes = this.queryString.attributes.split(',');
      
      // Remove password field
      for( var i = 0; i < this.query.attributes.length; i++){ 
        if ( this.query.attributes[i] === 'password') { 
          this.query.attributes.splice(i, 1); 
        }
      }
    } else {
      this.query.attributes = { exclude: ['password', 'createdBy', 'updatedAt', 'updatedBy']};
    }

    return this;
  }

  paginate () {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const offset = (page -1) * limit;
    this.query.offset = offset;
    this.query.limit = limit;

    return this;
  }
};

module.exports = APIFeatures;