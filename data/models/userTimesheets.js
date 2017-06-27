/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userTimesheets', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    eventShiftID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    breaks: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    useAgain: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(1)'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(0)'
    },
    staffConfirmed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(0)'
    },
    worked: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(0)'
    },
    paid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '(0)'
    },
    dateStamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(getdate())'
    },
    clientFeedbackID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((0))'
    },
    clientFeedbackDescription: {
      type: DataTypes.STRING,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    CommentVisible: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'userTimesheets'
  });
};
