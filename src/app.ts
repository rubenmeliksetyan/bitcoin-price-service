import express from 'express';
import dotenv from 'dotenv';
import { getBitcoinPrice, applyCommissionAndCalculateMidPrice } from './services/binanceService';
import { initializeCache } from './services/httpService';
import { CacheService } from './services/redisService';
import { getPriceHandler } from './services/httpService';


dotenv.config();

const PORT = process.env.PORT || 3000;
const UPDATE_FREQUENCY = parseInt(process.env.UPDATE_FREQUENCY || '10000', 10);
const SERVICE_COMMISSION = parseFloat(process.env.SERVICE_COMMISSION || '0.0001');
const cacheService = new CacheService(process.env.REDIS_URL || 'redis://localhost:6379');

const app = express();

const fetchAndCachePrice = async () => {
    try {
        const priceData = await getBitcoinPrice();

        const processedPrice = applyCommissionAndCalculateMidPrice(priceData, SERVICE_COMMISSION);

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