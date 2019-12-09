import { Model } from 'sequelize';

class CheckIn extends Model {
  static init(sequelize) {
    super.init(null, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreignKey: 'student_id',
      as: 'student',
    });

    this.belongsTo(models.Registration, {
      foreignKey: 'registration_id',
      as: 'registration',
    });
  }
}

export default CheckIn;
