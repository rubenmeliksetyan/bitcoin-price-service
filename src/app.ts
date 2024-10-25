import express from 'express';
import dotenv from 'dotenv';
import BinanceService from './services/binanceService';
import { initializeCache } from './services/httpService';
import { CacheService } from './services/redisService';
import { getPriceHandler } from './services/httpService';

const binanceService = new BinanceService();

dotenv.config();

const PORT = process.env.PORT || 3000;
const UPDATE_FREQUENCY = parseInt(process.env.UPDATE_FREQUENCY || '10000', 10);
const cacheService = new CacheService(process.env.REDIS_URL || 'redis://localhost:6379');

const app = express();

const fetchAndCachePrice = async () => {
    try {
        const priceData = await binanceService.getBitcoinPrice();

        const processedPrice = binanceService.applyCommissionAndCalculateMidPrice(priceData);

        await cacheService.set('bitcoinPrice', JSON.stringify(processedPrice), UPDATE_FREQUENCY / 1000);

        console.log('Price updated and cached:', processedPrice);
    } catch (error) {
        console.error('Error fetching and caching price:', error);
    }
};

fetchAndCachePrice();

setInterval(fetchAndCachePrice, UPDATE_FREQUENCY);

app.get('/price', getPriceHandler);

(async () => {
    await initializeCache();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();