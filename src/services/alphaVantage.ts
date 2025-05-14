import axios from 'axios';

const BASE_URL = 'https://www.alphavantage.co/query';
const API_KEY = import.meta.env.VITE_APP_ALPHA_VANTAGE_API_KEY;

export const getDailyTimeSeries = async (symbol: string) => {
    const params = {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: 'compact',
        datatype: 'json',
        apikey: API_KEY,
    }

    const response = await axios.get(BASE_URL, {params});
    return response.data;
}