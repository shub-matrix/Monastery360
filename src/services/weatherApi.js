const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const MOCK_WEATHER_DATA = {
    main: {
        temp: 18,
        feels_like: 16,
        temp_min: 12,
        temp_max: 24,
        pressure: 1013,
        humidity: 65
    },
    weather: [
        {
            main: 'Clouds',
            description: 'few clouds',
            icon: '02d'
        }
    ],
    clouds: {
        all: 20
    },
    wind: {
        speed: 3.2
    },
    visibility: 10000,
    sys: {
        sunrise: Date.now() / 1000 - 3600,
        sunset: Date.now() / 1000 + 7200
    },
    rain: null
};

export const getWeatherData = async (location) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = {
            ...MOCK_WEATHER_DATA,
            main: {
                ...MOCK_WEATHER_DATA.main,
                temp: MOCK_WEATHER_DATA.main.temp + (Math.random() - 0.5) * 10,
                temp_max: MOCK_WEATHER_DATA.main.temp_max + (Math.random() - 0.5) * 5,
                temp_min: MOCK_WEATHER_DATA.main.temp_min + (Math.random() - 0.5) * 5,
                humidity: Math.floor(Math.random() * 40) + 40
            },
            clouds: {
                all: Math.floor(Math.random() * 80) + 10
            },
            wind: {
                speed: Math.random() * 5 + 1
            }
        };
        
        return mockData;
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to fetch weather data. Please try again later.');
    }
};

export const getWeatherForecast = async (location) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const forecastData = {
            list: Array.from({ length: 5 }, (_, i) => ({
                dt: Date.now() / 1000 + (i * 24 * 3600),
                main: {
                    temp: 15 + Math.random() * 15,
                    temp_max: 20 + Math.random() * 10,
                    temp_min: 10 + Math.random() * 10
                },
                weather: [
                    {
                        main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
                        description: ['clear sky', 'few clouds', 'light rain'][Math.floor(Math.random() * 3)]
                    }
                ]
            }))
        };
        
        return forecastData;
        
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        throw new Error('Failed to fetch weather forecast.');
    }
};

export const getLocationCoordinates = async (location) => {
    try {
        const sikkimLocations = {
            'gangtok': { lat: 27.3389, lon: 88.6065 },
            'namchi': { lat: 27.1666, lon: 88.3639 },
            'gyalshing': { lat: 27.2833, lon: 88.2667 },
            'mangan': { lat: 27.5167, lon: 88.5333 },
            'east sikkim': { lat: 27.3389, lon: 88.6065 },
            'west sikkim': { lat: 27.2833, lon: 88.2667 },
            'north sikkim': { lat: 27.7333, lon: 88.6167 },
            'south sikkim': { lat: 27.1666, lon: 88.3639 }
        };
        
        const locationKey = location.toLowerCase();
        for (const key in sikkimLocations) {
            if (locationKey.includes(key)) {
                return sikkimLocations[key];
            }
        }
        
        return sikkimLocations['gangtok'];
        
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return { lat: 27.3389, lon: 88.6065 };
    }
};

export default {
    getWeatherData,
    getWeatherForecast,
    getLocationCoordinates
};