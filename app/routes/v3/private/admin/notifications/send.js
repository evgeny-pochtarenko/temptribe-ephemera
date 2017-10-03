const ClientError = require('../../../../../../lib/errors/ClientError');
const notifications = require('../../../../../../lib/notifications');

function validateString(...args) {
  return args.every(function(arg) {
    return typeof(arg) === 'string' && arg;
  });
}

module.exports = function(router) {
  router.post('/send', function(req, res, next) {
    var { to, title, body } = req.body;
    if (!to || !validateString(title, body)) {
      throw new ClientError('invalid_notification', {message: 'Missing notification data'});
    }
    if (!Array.isArray(to)) {
      to = [to];
    }
    if (to.some(function(id) {
      return isNaN(parseInt(id));
    })) {
      throw new ClientError('invalid_notification', {message: 'Invalid to: data'});
    }
    return notifications.send(req.app.locals.models, to, title, body).then(function(users) {
      res.jsend({
        sentTo: users.map(function(user) {
          return user.id;
        })
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
  