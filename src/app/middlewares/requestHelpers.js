export default (request, response, next) => {
  request.all = () => {
    return request.body;
  };

  request.only = fields => {
    return Object.keys(request.all())
      .filter(field => fields.includes(field))
      .reduce((obj, key) => {
        obj[key] = request.all()[key];
        return obj;
      }, {});
  };

  return next();
};
