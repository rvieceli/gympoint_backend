import Sequelize, { Model } from 'sequelize';
import { isWithinInterval, parseISO } from 'date-fns';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {
        startDate: Sequelize.DATEONLY,
        endDate: Sequelize.DATEONLY,
        price: Sequelize.INTEGER,
        active: {
          type: Sequelize.VIRTUAL(Sequelize.BOOLEAN, [
            'start_date',
            'end_date',
          ]),
          get() {
            if (!this.get('start_date') || !this.get('end_date')) return false;
            return isWithinInterval(new Date(), {
              start: parseISO(this.get('start_date')),
              end: parseISO(this.get('end_date')),
            });
          },
        },
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
