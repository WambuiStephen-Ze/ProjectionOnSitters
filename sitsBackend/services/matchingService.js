import  sitterProfile  from '../models/sitter.js';
// import { User } from '../models/userModel.js';

export const findMatchingSitters = async (userLocation) => {
  try {
    const sitters = await sitterProfile.findAll({
      where: {
        location: userLocation,
      },
    });

    // Filter sitters with non-empty availability
    const availableSitters = sitters.filter(sitter => {
      try {
        const availability = JSON.parse(sitter.availability || '{}');
        return Object.keys(availability).length > 0;
      } catch (error) {
        console.error(`Error parsing availability for sitter ${sitter.id}:`, error);
        return false;
      }
    });

    return availableSitters;
  } catch (error) {
    console.error('Error finding matching sitters:', error);
    throw error;
  }
};