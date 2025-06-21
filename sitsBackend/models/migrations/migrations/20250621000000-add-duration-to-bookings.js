module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('bookings', 'duration', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        });
    },
    down: async (queryInterface) => {
        await queryInterface.removeColumn('bookings', 'duration');
    }
};