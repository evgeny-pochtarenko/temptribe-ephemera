module.exports = function(router) {
  router.get('/applied', function(req, res, next) {
    var { shiftId } = req.params;
    var models = req.app.locals.models;
    models.eventShifts.find({
      where: {
        id: shiftId
      },
      include: [{
        model: models.userTimesheets.scope('onlyApplied'),
        as: 'timesheets',
        include: [{
          attributes: ['id'],
          model: models.users,
          as: 'user',
          required: true
        }],
        required: true
      }]
    }).then(function(shift) {
      res.jsend(shift.timesheets.map((timesheet) => timesheet.user.id));
    }).catch(function(err) {
      next(err);
    });
  });
}