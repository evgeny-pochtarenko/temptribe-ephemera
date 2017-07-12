var filterQuery = require('../../../../data/filters');
var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.post('/list/:detail(\\w+)', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var cache = req.app.locals.shiftlistCache;
    var detail = req.params.detail;
    var page = 1;
    var after = null;
    if (['standard', 'metadata'].indexOf(detail) === -1) {
      detail = 'standard';
    }
    if (req.body.page && 'number' === typeof(req.body.page)) {
      page = req.body.page;
    } else if (req.body.after && 'number' === typeof(req.body.after)) {
      after = req.body.after;
      page = null;
    }
    var filters = filterQuery(req, models);
    var key = JSON.stringify({
      filters: filters.key,
      detail,
    });
    cache.pget(key).then(function(result) {
      if (result) {
        return result;
      }
      return models.eventShifts.scope({
        method: ['staff', 'future', detail, filters.scope]
      }).findAndCountAll({
        distinct: true,
        col: 'eventShifts.id'
      }).then(function(result) {
        return cache.pset(key, result);
      }).catch(function(err) {
        throw err;
      });
    }).then(function(result) {
      var pageInfo = detail === 'metadata'? null: {
        page,
        limit: parseInt(process.env.SHIFTLIST_PAGE_SIZE, 10),
        after
      }
      res.json(eventHelpers.formatShiftList(result, detail, pageInfo));
    }).catch(function(err) {
      next(err);
    });
  });
}
