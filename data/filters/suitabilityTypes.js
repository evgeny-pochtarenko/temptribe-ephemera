module.exports = function(req, models, output) {
  var typeList = req.user.suitabilityTypes.map(function(type) {
    return type.id;
  });
  if (req.body.f && req.body.f.su) {
      var filterSuit = req.body.f.su;
      if (!Array.isArray(filterSuit)) {
          filterSuit = [filterSuit];
      }
      var selectedSet = new Set(filterSuit);
      var testList = Array.from(new Set(typeList)).filter(function(item) {
          return selectedSet.has(item);
      });
      if (testList.length) {
          typeList = testList;
      }
  }
  output.key.suitabilityTypes = typeList.sort();
  output.scope.include.suitabilityTypes = {
    where: {
      $and: {
        ID: {
          $in: typeList
        }
      }
    },
  }
}
