import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../connect_db/db.connect';
import { User } from './user-model';

interface TokenAttributes {
  id: number;
  refresh_token: string;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Token
  extends Model<TokenAttributes, Optional<TokenAttributes, 'id'>>
  implements TokenAttributes
{
  public id!: number;
  public refresh_token!: string;
  public user_id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    tableName: 'token',
  },
);

export { Token, TokenAttributes };
