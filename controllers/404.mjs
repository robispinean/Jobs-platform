// eslint-disable-next-line no-unused-vars
const errorController = (err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('404', { title: `${err.message}`, path: `/${err.status}` });
};

export default errorController;
