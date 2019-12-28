module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('plans', 'price', {
        type: Sequelize.DECIMAL(10, 2),
      }),
      queryInterface.changeColumn('registrations', 'price', {
        type: Sequelize.DECIMAL(10, 2),
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('plans', 'price', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.changeColumn('registrations', 'price', {
        type: Sequelize.INTEGER,
      }),
    ]);
  },
};
