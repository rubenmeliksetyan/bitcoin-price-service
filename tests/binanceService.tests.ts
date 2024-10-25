import axios from 'axios';
import BinanceService from "../src/services/binanceService";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BinanceService', () => {
    let binanceService: BinanceService;
    const mockApiUrl = 'https://mock-api.com';
    const commissionRate = 0.01;

    beforeEach(() => {
        binanceService = new BinanceService(mockApiUrl, commissionRate);
    });

    describe('getBitcoinPrice', () => {
        it('should fetch Bitcoin price successfully from the API', async () => {
            const mockResponse = { data: { bidPrice: '50000.00', askPrice: '50100.00' } };
            mockedAxios.get.mockResolvedValue(mockResponse);

            const result = await binanceService.getBitcoinPrice();
            expect(result).toEqual(mockResponse.data);
            expect(mockedAxios.get).toHaveBeenCalledWith(mockApiUrl);
        });

        it('should throw an error if API call fails', async () => {
            mockedAxios.get.mockRejectedValue(new Error('API error'));

            await expect(binanceService.getBitcoinPrice()).rejects.toThrow('Error fetching price from Binance');
        });
    });

    describe('applyCommissionAndCalculateMidPrice', () => {
        it('should calculate prices with commission correctly', () => {
            const priceData = { bidPrice: '50000.00', askPrice: '50100.00' };
            const expected = {
                bid: '50500.00',
                ask: '50601.00',
                midPrice: '50550.50',
            };

            const result = binanceService.applyCommissionAndCalculateMidPrice(priceData);
            expect(result).toEqual(expected);
        });

        it('should throw an error if bidPrice or askPrice is missing', () => {
            const priceData = { bidPrice: '', askPrice: '' };
            expect(() => binanceService.applyCommissionAndCalculateMidPrice(priceData)).toThrow(
                'Invalid input: bidPrice and askPrice are required.'
            );
        });

        it('should throw an error if bidPrice or askPrice is not a valid number', () => {
            const priceData = { bidPrice: 'not-a-number', askPrice: '50100.00' };
            expect(() => binanceService.applyCommissionAndCalculateMidPrice(priceData)).toThrow(
                'Invalid input: bidPrice and askPrice must be valid numbers.'
            );
        });

        it('should throw an error if bidPrice or askPrice is non-positive', () => {
            const priceData = { bidPrice: '-50000.00', askPrice: '0' };
            expect(() => binanceService.applyCommissionAndCalculateMidPrice(priceData)).toThrow(
                'Invalid input: bidPrice and askPrice must be positive numbers.'
            );
        });
    });

    describe('calculateCommission', () => {
        it('should correctly apply commission to a given price', () => {
            const price = 100;
            const expected = 100 * (1 + commissionRate);
            const result = binanceService['calculateCommission'](price); // Accessing private method for testing
            expect(result).toBeCloseTo(expected);
        });
    });
});