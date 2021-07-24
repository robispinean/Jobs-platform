const indexController = (req, res) => {
  res.render('index', {
    title: 'Express',
  });
};

export default indexController;
