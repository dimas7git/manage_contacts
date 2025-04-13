module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      token_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  };
  