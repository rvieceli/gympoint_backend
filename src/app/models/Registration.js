import Sequelize, { Model } from 'sequelize';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {
        startDate: Sequelize.DATEONLY,
        endDate: Sequelize.DATEONLY,
        price: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
    this.hasMany(models.CheckIn, {
      foreignKey: 'registration_id',
      as: 'checkIns',
    });
  }
}

export default Registration;
