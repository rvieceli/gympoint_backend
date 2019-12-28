module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('students', 'access_token', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('students', 'access_token');
  },
};
