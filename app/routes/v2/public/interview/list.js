module.exports = function(router) {
  router.get('/list', function(req, res, next) {
    var models = req.app.locals.models;
    return models.trainingSessions.scope(['future']).findAll({
      include: [{
        model: models.userTrainingSessionApplications,
        attributes: ['id', 'status'],
        where: {
          status: 4
        },
        required: false
      }],
    }).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      next(err);
    });
  });
}
