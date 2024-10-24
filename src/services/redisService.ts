import { createClient } from 'redis';
import { ICacheService } from './cacheInterface';

export class CacheService implements ICacheService {
    private client;

    constructor(private url: string) {
        this.client = createClient({ url: this.url });
    }

    async connect(): Promise<void> {
        this.client.on('error', (err) => console.error('Cache Service Error', err));
        await this.client.connect();
        console.log('Connected to Cache Service (Redis)');
    }

    async disconnect(): Promise<void> {
        await this.client.disconnect();
        console.log('Disconnected from Cache Service (Redis)');
    }

    async set(key: string, value: string, expireInSeconds?: number): Promise<void> {
        if (expireInSeconds) {
            await this.client.set(key, value, { EX: expireInSeconds });
        } else {
            await this.client.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }
}