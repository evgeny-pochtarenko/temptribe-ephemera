var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.get('/shifts/:status(\\w+)', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    if (['confirmed', 'applied', 'cancelled', 'history'].indexOf(req.params.status) === -1) {
      req.params.status = 'confirmed';
    }
    models.users.scope({ method: ['shifts', req.params.status] }).findById(req.user.id).then(function(result) {
      if (result) {
        var shifts = result.timesheets.map(function(timesheet) {
          return timesheet.shift;
        }).sort(eventHelpers.sortByShift(req.params.status === 'history'));
      } else {
        shifts = [];
      }
      res.json({
        total: shifts.length,
        shifts
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
