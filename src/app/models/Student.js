import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.FLOAT,
        height: Sequelize.FLOAT,
        accessToken: Sequelize.STRING(4),
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Registration, {
      foreignKey: 'student_id',
      as: 'registrations',
    });
    this.hasMany(models.CheckIn, {
      foreignKey: 'student_id',
      as: 'checkIns',
    });
    this.hasMany(models.HelpOrder, {
      foreignKey: 'student_id',
      as: 'helpOrders',
    });
  }
}

export default Student;
