'use strict';
const { Model } = require('sequelize');
//validate form fields - if not, throw error message requesting sting item  
module.exports = (sequelize, DataTypes) => {
    class User extends Model {};
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name required.'
                },
                notEmpty: {
                    msg: 'Please provide your first name.'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Last name required.'
                },
                notEmpty: {
                    msg: 'Please provide your last name.'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Email you entered is already in use.'
            },
            validate: {
                notNull: {
                    msg: 'Email address required.'
                },
                isEmail: {
                    msg: 'Please provide a valid email address.'
                },
                notEmpty: {
                    msg: 'Please provide your email address.'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            
            validate: {
                notNull: {
                    msg: 'A password is required.'
                },
                notEmpty: 'Please provide a password.'
            },
        }, 
    }, { sequelize, modelName: 'User' });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            }
        })
    };
    return User;
};