// sitter.js
import { DataTypes } from 'sequelize';

const sitterProfile = (sequelize) => {
  return sequelize.define('sitter', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    availability: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'sitters',
    timestamps: true,
  });
};

export default sitterProfile;
