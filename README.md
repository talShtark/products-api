<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


# Project Overview

This project is an implementation of a REST API for managing a store's inventory system. It allows for creating, updating, deleting, and retrieving products, as well as querying products based on various criteria such as stock levels, popularity, and search terms.

## Architecture and Design Patterns

- **Repository Pattern**: Abstracts the data access layer from the business logic layer, promoting code reusability and testability.
- **Dependency Injection**: Utilizes NestJS's dependency injection to promote loose coupling between components for better maintainability.
- **Separation of Concerns**: Divides the codebase into distinct layers like repositories, services, controllers, and DTOs for improved maintainability.
- **Error Handling**: Implements custom exceptions and a global exception filter for consistent and centralized error management.
- **Validation**: Integrates with the class-validator library for defining and enforcing validation rules via DTOs.
- **Clean Code Practices**: Adheres to practices like DRY, using descriptive names, and organizing code into reusable units.

## Key Features

- **Product Creation**: Allows creating new products with unique name validation.
- **Product Updates**: Supports updating existing products, including name uniqueness checks.
- **Product Deletion**: Facilitates deleting products, ensuring no pending orders exist.
- **Product Listing**: Offers sorting, pagination, and search filtering for listing products.
- **Low Stock Query**: Retrieves products with stock levels below a specified threshold.
- **Popularity Query**: Identifies the most popular products based on sales data.

## Project Structure

- **repositories/**: Houses the repository implementations and interfaces.
- **services/**: Contains the business logic services.
- **controllers/**: Manages the API route controllers.
- **dtos/**: Defines Data Transfer Objects for input validation.
- **entities/**: Includes the entity definitions (e.g., Product class).
- **exceptions/**: Contains custom exception classes for error handling.



## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

API will be available at http://localhost:3000/api
```

## Test

```bash
# unit tests
$ npm run test
```
