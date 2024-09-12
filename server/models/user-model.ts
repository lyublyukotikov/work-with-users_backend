import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../connect_db/db.connect';

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class User
  extends Model<UserAttributes, Optional<UserAttributes, 'id'>>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: 'ADMIN' | 'USER';
  public avatar?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'USER'),
      defaultValue: 'USER',
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'User',
  },
);

export { User };
