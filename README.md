# Bitcoin Price Service

A Node.js application that fetches the current Bitcoin price from the Binance API, caches it in Redis, and provides an API endpoint to retrieve the price.

## Features

- Fetch Bitcoin prices from the Binance API.
- Cache prices in Redis for fast retrieval.
- API endpoint to serve the cached Bitcoin price.

## Requirements

- Docker
- Node.js (v14 or later)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rubenmeliksetyan/bitcoin-price-service
   cd bitcoin-price-service
   
2. Install dependencies:
   ```bash
   npm install 

## Configuration

	•	BINANCE_API_URL: The URL for the Binance API (default: https://api.binance.com/api/v3/ticker/bookTicker?symbol=BTCUSDT).
	•	REDIS_URL: The URL for the Redis server (default: redis://localhost:6379).
	•	SERVICE_COMMISSION: The commission percentage to apply to prices (default: 0.0001).
	•	PORT: The port application should run (defult: 3000)
	•	UPDATE_FREQUENCY: The update frequency (defult: 10000 ms)

    

You can create a .env file in the project root to define these variables:

# Running with Docker Compose

1. Build and start the application and Redis service:
    ```bash
    docker-compose up --build
2. Access the API endpoint to get the Bitcoin price:
   ```url
   GET http://localhost:{{PORT}}/api/price 
   # port provided in .env file
3.	To stop the application, use:
      ```bash
      docker-compose down
      
# Running Tests

To run the tests, use the following command:
```bash
npm test
