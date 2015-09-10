/** impressum */
exports.render = function(req, res, next) {
  res.render('legal/impressum', {title: 'Express', appTitle: 'SimplyFi'});
};