export interface ICacheService {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    set(key: string, value: string, expireInSeconds?: number): Promise<void>;
    get(key: string): Promise<string | null>;
}