import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

export const fetchMonasteries = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/monasteries`);
        return response.data;
    } catch (error) {
        console.error('Error fetching monasteries:', error);
        throw error;
    }
};

export const fetchEvents = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/events`);
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

export const fetchMonasteryDetails = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/monasteries/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for monastery ${id}:`, error);
        throw error;
    }
};