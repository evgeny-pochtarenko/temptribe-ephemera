var filterQuery = require('../../../../data/filters');
var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.post('/list/:detail(\\w+)', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var cache = req.app.locals.shiftlistCache;
    if (['full', 'minimal', 'listonly'].indexOf(req.params.detail) === -1) {
      req.params.detail = 'minimal';
    }
    var filters = filterQuery(req, models);
    var key = JSON.stringify({
      detail: req.params.detail,
      filters: filters.key
    });
    cache.pget(key).then(function(result) {
      if (result) {
        return result;
      }
      var findTerms = {
        distinct: true,
        col: 'eventShifts.id',
        limit: process.env.SHIFTLIST_PAGE_SIZE
      };
      return models.eventShifts.scope({
        method: ['staff', 'future', req.params.detail, filters.scope]
      }).findAndCountAll(findTerms).then(function(result) {
        var response = {
          total: result.count,
          shifts: result.rows.map(function(shift) {
            return eventHelpers.formatShift(shift.get({ plain: true }), req.params.detail);
          })
        };
        return cache.pset(key, response);
      }).catch(function(err) {
        throw err;
      });
    }).then(function(response) {
      res.json(response);
    }).catch(function(err) {
      next(err);
    });
  });
}
