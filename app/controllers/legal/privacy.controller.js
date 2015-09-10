/** privacy statement */
exports.render = function(req, res, next) {
  res.render('legal/datenschutzerklaerung', {title: 'Express', appTitle: 'SimplyFi'});
};