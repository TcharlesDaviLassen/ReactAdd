import { DataTypes, Model } from 'sequelize';
import db from '../db';

class ProvidersModel extends Model {
  declare id: number;
  declare name: string;
  declare age: string;
  declare sex: string;
  declare email: string;


};

ProvidersModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sex: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
  {
    sequelize: db,
    tableName: 'providers',
    modelName: 'Providers'
  });

export default ProvidersModel;