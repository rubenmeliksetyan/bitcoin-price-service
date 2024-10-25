import express from 'express';
import dotenv from 'dotenv';
import BinanceService from './services/binanceService';
import CacheController from './services/CacheController';
import RedisService from './services/redisService';

const binanceService = new BinanceService();

dotenv.config();

const PORT = process.env.PORT || 3000;
const UPDATE_FREQUENCY = parseInt(process.env.UPDATE_FREQUENCY || '10000', 10);
const redisService = new RedisService(process.env.REDIS_URL || 'redis://localhost:6379');
const cacheController = new CacheController();
const app = express();

const fetchAndCachePrice = async () => {
    try {
        const priceData = await binanceService.getBitcoinPrice();

        const processedPrice = binanceService.applyCommissionAndCalculateMidPrice(priceData);

        await redisService.set('bitcoinPrice', JSON.stringify(processedPrice), UPDATE_FREQUENCY / 1000);

        console.log('Price updated and cached:', processedPrice);
    } catch (error) {
        console.error('Error fetching and caching price:', error);
    }
};

fetchAndCachePrice();

setInterval(fetchAndCachePrice, UPDATE_FREQUENCY);

app.get('/price', cacheController.getPrice.bind(cacheController));

cacheController.initialize().then(() => {
    console.log('Cache connected');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}).catch((error) => {
    console.error('Failed to initialize cache:', error);
    process.exit(1);
});