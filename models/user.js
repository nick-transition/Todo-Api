module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user',{
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNUll: false,
      validate: {
        len: [7,100]
      }
    }
  })

}
