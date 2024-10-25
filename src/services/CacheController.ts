import { Request, Response } from 'express';
import RedisService from './redisService';
import {ICacheService} from "./cacheInterface";

class CacheController {
    private cacheService: ICacheService;

    constructor(redisUrl: string = process.env.REDIS_URL || 'redis://localhost:6379') {
        this.cacheService = new RedisService(redisUrl);
    }

    /**
     * Retrieves the cached Bitcoin price or returns a 503 status if not available.
     * @param req
     * @param res
     */
    public async getPrice(req: Request, res: Response): Promise<void> {
        try {
            const cachedPrice = await this.cacheService.get('bitcoinPrice');

            if (cachedPrice) {
                res.json(JSON.parse(cachedPrice));
            } else {
                res.status(503).json({ message: 'Price not available' });
            }
        } catch (error) {
            console.error('Error retrieving price from cache:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Initializes the cache connection.
     */
    public async initialize(): Promise<void> {
        await this.cacheService.connect();
    }
}

export default CacheController;