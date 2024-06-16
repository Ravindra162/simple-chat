const { DataTypes } = require('sequelize')
const {sequelize} = require('../db')
const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    recipient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey:true
    },
    type: {
      type: DataTypes.ENUM('friend_request_accept', 'message'),
      allowNull: false,
      primaryKey:true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      primaryKey:true
    }
  }, {
    tableName: 'notifications',
    timestamps: true,
    hooks: {
      // Hook called after a notification is updated
      afterUpdate: async (notification, options) => {
        // Check if the notification is marked as read
        if (notification.changed('is_read') && notification.is_read) {
          // Delete the notification
          await Notification.destroy({ where: { id: notification.id } });
        }
      }
    }
  });
  const createNotification = async () => {
    await Notification.sync({alter:true})
  }

  createNotification()
  
  module.exports = {Notification};

  