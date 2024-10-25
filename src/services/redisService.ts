import { createClient } from 'redis';

export default class RedisService {
    private client;
    private isConnected: boolean = false;

    constructor(redisUrl: string) {
        this.client = createClient({ url: redisUrl });
        this.client.on('error', (err) => console.error('Redis Client Error', err));
    }

    public async connect() {
        if (!this.isConnected) {
            await this.client.connect();
            this.isConnected = true;
        }
    }

    public async set(key: string, value: string, expireInSeconds?: number) {
        if (!this.isConnected) {
            await this.connect();
        }
        expireInSeconds ? await this.client.set(key, value, { EX: expireInSeconds }) : await this.client.set(key, value);
    }

    public async get(key: string): Promise<string | null> {
        if (!this.isConnected) {
            await this.connect();
        }
        return await this.client.get(key);
    }

    public async disconnect() {
        await this.client.disconnect();
        this.isConnected = false;
    }
}