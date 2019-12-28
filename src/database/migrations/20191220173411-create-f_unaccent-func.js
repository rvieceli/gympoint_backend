module.exports = {
  up: queryInterface => {
    return Promise.all([
      queryInterface.sequelize.query(`
        CREATE EXTENSION IF NOT EXISTS unaccent;
        CREATE OR REPLACE FUNCTION f_unaccent(text)
          RETURNS text AS
        $func$
        SELECT public.unaccent('public.unaccent', $1)
        $func$
        LANGUAGE sql
        IMMUTABLE;
      `),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.sequelize.query(`
        DROP FUNCTION IF EXISTS f_unaccent;
        DROP EXTENSION IF EXISTS unaccent;
      `),
    ]);
  },
};
