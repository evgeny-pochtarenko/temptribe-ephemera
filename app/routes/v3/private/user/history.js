const HISTORY_STATUSES = new Map([
  ['incomplete', 0],
  ['unconfirmed', 1],
  ['complete', 2],
]);

module.exports = function(router) {
  router.get('/history', function(req, res, next) {
    var { sequelize } = req.app.locals;
    var { status } = req.query;
    var limit = parseInt(req.query.limit);
    var month = parseInt(req.query.month);
    var year = parseInt(req.query.year);
    if (!status || !HISTORY_STATUSES.has(status)) {
      status = 'complete';
    }
    if (isNaN(limit)) {
      limit = 50;
    }
    if (isNaN(month)) {
      month = null;
    }
    if (isNaN(year)) {
      year = null;
    }
    return sequelize.query(`select paid, timesheetID, timesheetStatus,
      staffStartTime, staffEndTime, staffBreaks, staffWorked, shiftID,
      originalStartTime, originalEndTime, originalBreaks,
      hourlyRate, [date], eventID, eventTitle, eventSubtitle, jobRole, clientName, venueID, venueName,
      venueImage, unpaidBreaks from dbo.udf_userWorkHistory(:userId, :status, :limit, :month, :year)`,
    {
      replacements: {
        userId: req.user.id,
        status: HISTORY_STATUSES.get(status),
        limit,
        month,
        year
      },
      type: sequelize.QueryTypes.SELECT
    }).then(function(result) {
      res.jsend(result);
    }).catch(function(err) {
      next(err);
    });
  });
}
