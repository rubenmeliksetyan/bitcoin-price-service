import RedisService from '../services/redisService';
import { createClient } from 'redis';
import {ICacheService} from "../services/cacheInterface";

jest.mock('redis', () => {
    const mRedisClient = {
        connect: jest.fn(),
        disconnect: jest.fn(),
        get: jest.fn(),
        set: jest.fn(),
        on: jest.fn(),
    };
    return {
        createClient: jest.fn(() => mRedisClient),
    };
});

describe('CacheService', () => {
    let redisService: ICacheService;
    let redisClient: any;

    beforeEach(() => {
        redisClient = createClient();
        redisService = new RedisService('redis://localhost:6379');
    });

    it('should connect to Redis', async () => {
        await redisService.connect();
        expect(redisClient.connect).toHaveBeenCalled();
    });

    it('should disconnect from Redis', async () => {
        await redisService.disconnect();
        expect(redisClient.disconnect).toHaveBeenCalled();
    });

    it('should set a key in Redis', async () => {
        await redisService.set('key', 'value', 100);
        expect(redisClient.set).toHaveBeenCalledWith('key', 'value', { EX: 100 });
    });

    it('should get a key from Redis', async () => {
        redisClient.get.mockResolvedValue('value');
        const value = await redisService.get('key');
        expect(value).toBe('value');
        expect(redisClient.get).toHaveBeenCalledWith('key');
    });
});