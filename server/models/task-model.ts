import { DataTypes, Model } from 'sequelize';
import sequelize from '../connect_db/db.connect';

export interface TaskAttributes {
  id: number;
  title: string;
  description?: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TaskCreationAttributes = Partial<TaskAttributes>;

class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  public id!: number;
  public title!: string;
  public description?: string;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Task',
  },
);

export { Task };
