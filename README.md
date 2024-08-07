# Node.js Microservices Boilerplate

This boilerplate project provides a simple foundation for implementing microservices using Node.js and Express.js. It includes essential features such as message queue management with RabbitMQ, and service-to-service communication using a global event bus.

## Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing.

### Prerequisites

If you are not using [Docker](https://docs.docker.com/), make sure you have the following software installed:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [MongoDB](https://www.mongodb.com/)
- [RabbitMQ](https://www.rabbitmq.com/)

If you are using Docker, these prerequisites are not necessary to be installed locally.

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/sargas-company/rabbitmq-node
    cd rabbitmq-node
    ```

2. **Start the development environment using Docker Compose:**

    ```bash
    docker-compose up -d
    ```

   The services will be running at `http://localhost:3000` for `api-gateway`.

   Note: The RabbitMQ container might take up to 30 seconds to become healthy due to its health check interval.

If you prefer to manually set up the environment without Docker, follow these steps:

1. **Install Node.js and npm**:

   Ensure you have Node.js and npm installed. You can download and install them from [nodejs.org](https://nodejs.org/).

2. **Install RabbitMQ**:

   Download and install RabbitMQ from [rabbitmq.com](https://www.rabbitmq.com/download.html).

3. **Set up `api-gateway` service**:

    ```bash
    cd api-gateway
    cp .env.example .env
    npm install            
    npm run build
    npm start
    ```

4. **Set up `sample-service`**:

    ```bash
    cd sample-service
    cp .env.example .env
    npm install
    npm run build
    npm start
    ```

5. **Configure RabbitMQ**:

   - Ensure RabbitMQ is running.
   - Set up the necessary exchanges and queues as required by your services. You can refer to the RabbitMQ documentation for more details.

### Example API Request

Here's how to get a sample data from the `sample-service` using `curl`:

    curl -X GET \
         -H "Content-Type: application/json" \
         http://localhost:3000/sample-service

## Features

### Message Queue Management

Handles communication between services using RabbitMQ for event-driven architecture.

### Service-to-Service Communication

Utilizes a global event bus for robust inter-service communication.

## Project Structure

The project is organized as follows:

    ├── doc
    │   └── rabbitmq-node.postman_collection.json # Postman collection 
    ├── api-gateway
    │   ├── src
    │   │   ├── config        # Configuration files
    │   │   ├── constants     # Constants and enums
    │   │   ├── controllers   # Route controllers
    │   │   ├── cron          # CRON jobs sheduler
    │   │   ├── errors        # Error handling utilities
    │   │   ├── helpers       # Helpers functions
    │   │   ├── rabbitMQ      # RabbitMQ services, helpers, etc.
    │   │   ├── routes        # Express routes
    │   │   ├── app.ts        # Express application setup
    │   │   └── index.js      # Entry point of the application
    │   ├── .env.example      # Example environment variables
    │   ├── .eslintignore     # ESLint ignore file
    │   ├── .eslintrc.js      # ESLint configuration
    │   ├── .prettierrc       # Prettier configuration
    │   ├── .Dockerfile       # Docker configuration
    │   ├── package.json      # NPM dependencies and scripts
    │   ├── package-lock.json # Locked versions of dependencies
    │   └── tsconfig.json     # TypeScript configuration
    ├── sample-service
    │   ├── src
    │   │   ├── config        # Configuration files
    │   │   ├── controllers   # Route controllers
    │   │   ├── errors        # Error handling utilities
    │   │   ├── rabbitMQ      # RabbitMQ services, helpers, etc.
    │   │   ├── types         # TypeScript types and interfaces
    │   │   ├── app.ts        # Express application setup
    │   │   └── index.js      # Entry point of the applicatio
    │   ├── .env.example      # Example environment variables
    │   ├── .eslintignore     # ESLint ignore file
    │   ├── .eslintrc.js      # ESLint configuration
    │   ├── .prettierrc       # Prettier configuration
    │   ├── .Dockerfile       # Docker configuration
    │   ├── package.json      # NPM dependencies and scripts
    │   ├── package-lock.json # Locked versions of dependencies
    │   └── tsconfig.json     # TypeScript configuration
    ├── docker-compose.yml    # Docker Compose configuration
    ├── README.md             # Project documentation
    └── LICENSE               # License file

## Built With

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [amqplib](https://www.npmjs.com/package/amqplib)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [compression](https://www.npmjs.com/package/compression)
- [config](https://www.npmjs.com/package/config)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [ts-node-dev](https://www.npmjs.com/package/ts-node-dev)
- [http-status-codes](https://www.npmjs.com/package/http-status-codes)
- [uuid](https://www.npmjs.com/package/uuid)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.
