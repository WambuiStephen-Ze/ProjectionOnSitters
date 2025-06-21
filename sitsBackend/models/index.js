import Sequelize  from 'sequelize';
import dotenv from 'dotenv';
import userModel from './userModel.js';
import sitterProfile from './sitter.js';
import bookingModel from './booking.js';



dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER, 
    process.env.DB_PASS, {

    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
});

const User = userModel(sequelize);
const Sitter = sitterProfile(sequelize);
const Booking = bookingModel(sequelize); 
// Define associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'Bookings' });
Sitter.hasMany(Booking, { foreignKey: 'sitterId', as: 'Bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'User' });
Booking.belongsTo(Sitter, { foreignKey: 'sitterId', as: 'Sitter' });

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connected successfully');
        await sequelize.sync({ alter: false});
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
};


// Added missing 'ageKids'
const createUser = async ({ firstname, lastname, email,  phone,numKids,password ,profilePic, location, ageKids }) => {
    try {
        const user = await User.create({
            firstname,
            lastname,
            email,
            phone,
            numKids,
            password,
            profilePic,
            location,
            ageKids,
        });
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            numKids: user.numKids,
            profilePic: user.profilePic,
            location: user.location,
            ageKids: user.ageKids,            
        };
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error(`Failed to create user: ${error.message}`);
    }
};

const getUserById = async (id) => {
    try {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
};

const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });
        return user; // Allow null for registration checks
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error(`Failed to fetch user by email: ${error.message}`);
    }
};

const updateUser = async (id, updates) => {
    try {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');
        await user.update(updates);
        return user;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error(`Failed to update user: ${error.message}`);
    }
};


// Sitter related functions
const createSitter = async ({ userId, firstname, lastname, email, password, phone, profilePic, location, numKids }) => {
    try {
        const user = await User.create({
            firstname,
            lastname,
            email,
            password,
            phone,
            profilePic,
            location,
            numKids,
        });
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            profilePic: user.profilePic,
            location: user.location,
            numKids: user.numKids,
        };
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error(`Failed to create user: ${error.message}`);
    }
};

const getAllSitters = async () => {
    try {
        const sitters = await Sitter.findAll();
        return sitters;
    } catch (error) {
        console.error('Error fetching sitters:', error);
        throw new Error(`Failed to fetch sitters: ${error.message}`);
    }
};

const getSitterById = async (id) => {
    try {
        const sitter = await Sitter.findByPk(id);
        if (!sitter) throw new Error('Sitter not found');
        return sitter;
    } catch (error) {
        console.error('Error fetching sitter:', error);
        throw new Error(`Failed to fetch sitter: ${error.message}`);
    }
};

const getSitterByEmail = async (email) => {
    try {
        const sitter = await Sitter.findOne({ where: { email } });
        return sitter; // Allow null for registration checks
    } catch (error) {
        console.error('Error fetching sitter by email:', error);
        throw new Error(`Failed to fetch sitter by email: ${error.message}`);
    }
};

const updateSitter = async (id, updates) => {
    try {
        const sitter = await Sitter.findByPk(id);
        if (!sitter) throw new Error('Sitter not found');
        await sitter.update(updates);
        return sitter;
    } catch (error) {
        console.error('Error updating sitter:', error);
        throw new Error(`Failed to update sitter: ${error.message}`);
    }
};

export { sequelize, connectDB, User, Sitter,Booking, createUser, getUserById, getUserByEmail, updateUser, createSitter,getAllSitters, getSitterById, getSitterByEmail, updateSitter };