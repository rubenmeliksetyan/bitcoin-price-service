import { Request, Response } from 'express';
import { CacheService } from './redisService';

const cacheService = new CacheService(process.env.REDIS_URL || 'redis://localhost:6379');

export const getPriceHandler = async (req: Request, res: Response) => {
    try {
        const cachedPrice = await cacheService.get('bitcoinPrice');

        if (cachedPrice) {
            res.json(JSON.parse(cachedPrice));
        } else {
            res.status(503).json({ message: 'Price not available' });
        }
    } catch (error) {
        console.error('Error retrieving price from cache:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const initializeCache = async () => {
    await cacheService.connect();
};