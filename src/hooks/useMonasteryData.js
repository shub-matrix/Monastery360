import { useState, useEffect } from 'react';
import monasteryData from '../data/monasteries.json';

const useMonasteryData = () => {
    const [monasteries, setMonasteries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Load data from monasteries.json
        setTimeout(() => {
            setMonasteries(monasteryData);
            setLoading(false);
        }, 500);
    }, []);

    return { monasteries, loading, error };
};

export default useMonasteryData;