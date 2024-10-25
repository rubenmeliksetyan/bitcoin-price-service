import axios from 'axios';

class BinanceService {
    private readonly apiUrl: string;
    private readonly commission: number;

    constructor(
        apiUrl: string = process.env.BINANCE_API_URL || 'https://api.binance.com/api/v3/ticker/bookTicker?symbol=BTCUSDT',
        commission: number = parseFloat(process.env.SERVICE_COMMISSION || '0.0001')
    ) {
        this.apiUrl = apiUrl;
        this.commission = commission;
    }

    /**
     * Fetches the current Bitcoin price from Binance API.
     * @returns {Promise<{ bidPrice: string; askPrice: string }>}
     */
    public async getBitcoinPrice(): Promise<{ bidPrice: string; askPrice: string }> {
        try {
            const response = await axios.get(this.apiUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching price from Binance', error);
            throw new Error('Error fetching price from Binance');
        }
    }

    /**
     * Applies a commission to the bid and ask prices, then calculates the mid-price.
     * @param priceData
     * @returns {Object}
     */
    public applyCommissionAndCalculateMidPrice(priceData: { bidPrice: string; askPrice: string }) {
        if (!priceData || !priceData.bidPrice || !priceData.askPrice) {
            throw new Error('Invalid input: bidPrice and askPrice are required.');
        }

        const bid = parseFloat(priceData.bidPrice);
        const ask = parseFloat(priceData.askPrice);

        if (isNaN(bid) || isNaN(ask)) {
            throw new Error('Invalid input: bidPrice and askPrice must be valid numbers.');
        }

        if (bid <= 0 || ask <= 0) {
            throw new Error('Invalid input: bidPrice and askPrice must be positive numbers.');
        }

        const bidWithCommission = this.calculateCommission(bid);
        const askWithCommission = this.calculateCommission(ask);
        const midPrice = (bidWithCommission + askWithCommission) / 2;

        return {
            bid: bidWithCommission.toFixed(2),
            ask: askWithCommission.toFixed(2),
            midPrice: midPrice.toFixed(2),
        };
    }
    
    private calculateCommission(price: number): number {
        return price * (1 + this.commission);
    }
}

export default BinanceService;