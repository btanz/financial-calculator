exports.render = function(req, res, next) {
  res.render('landing/landing', {title: 'Express', appTitle: 'SimplyFi'});
};