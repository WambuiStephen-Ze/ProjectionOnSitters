// booking.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('Booking', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sitterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
            defaultValue: 'pending',
        },
        confirmationEmail: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        timestamps: false,
        tableName: 'bookings',
    });
};

// export default booking;