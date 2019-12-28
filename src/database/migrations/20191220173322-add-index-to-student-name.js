module.exports = {
  up: queryInterface => {
    return queryInterface.addIndex('students', ['name']);
  },

  down: queryInterface => {
    return queryInterface.removeIndex('students', ['name']);
  },
};
