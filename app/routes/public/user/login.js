var jwt = require('jsonwebtoken');

module.exports = function(router) {
  router.post('/login', function(req, res, next) {
    try {
      if (!req.body.email || !req.body.password) {
        res.status(401).json({
          success: false,
          error: 'Missing email or password'
        });
        return;
      }
      var models = req.app.locals.models;
      var sequelize = req.app.locals.sequelize;
      models.users.findOne({
        attributes: [
          'id',
          'email'
        ],
        where: {
          $and: {
            email: req.body.email,
            password: sequelize.fn('dbo.udf_CalculateHash', sequelize.fn('concat', req.body.password, sequelize.col('salt')))
          }
        }
      }).then(function(result) {
        if (!result) {
          res.status(401).json({
            success: false,
            error: 'Unknown user or password'
          });
        } else {
          var user = result.get({
            plain: true
          });
          res.json({
            success: true,
            userID: user.id,
            token: jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 1000000 })
          });
        }
      }).catch(function(err) {
        res.status(401).json({
          success: false,
          error: 'Unknown user or password'
        });
      });
    } catch (ex) {
      res.status(401).json({
        success: false,
        error: ex.message
      });
    }
  });
}