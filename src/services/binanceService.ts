import axios from 'axios';

const BINANCE_API_URL =  process.env.BINANCE_API_URL || 'https://api.binance.com/api/v3/ticker/bookTicker?symbol=BTCUSDT';

export const getBitcoinPrice = async (): Promise<{ bidPrice: string; askPrice: string }> => {
    try {
        const response = await axios.get(BINANCE_API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching price from Binance', error);
        throw new Error('Error fetching price from Binance');
    }
};

export const applyCommissionAndCalculateMidPrice = (priceData: { bidPrice: string; askPrice: string }, commission: number) => {
    const bid = parseFloat(priceData.bidPrice);
    const ask = parseFloat(priceData.askPrice);
    const commissionMultiplier = 1 + commission;

    const bidWithCommission = bid * commissionMultiplier;
    const askWithCommission = ask * commissionMultiplier;
    const midPrice = (bidWithCommission + askWithCommission) / 2;

    return {
        bid: bidWithCommission.toFixed(2),
        ask: askWithCommission.toFixed(2),
        midPrice: midPrice.toFixed(2),
    };
};