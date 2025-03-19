# Eventshuffle
Event scheduling service API

Eventshuffle is an application to help scheduling events with friends, quite like http://doodle.com/ but in a much simplified way.

__See './scripts' for common development and maintenance actions__


## Project structure
- `root`              -- project and top level deployment configurations
- `./scripts`         -- common development and maintenances actions
- `./src`             -- app entrypoint files
- `./src/endpoints`   -- public API setup
- `./src/operations`  -- domain logic functions
- `./src/services`    -- external services


## About code architecture
The app is divided into three main parts: public API, domain logic
and external service integrations. These parts are loosely coupled
by passing required parts as a parameter to the other parts. By
doing so, some parts can be easily replaced by another
implementation – for testing purposes for example.

It is important to keep each part ignorant of other parts'
implementation details. Domain logic should not need to know about
API details, nor about how external services work. API should not
worry about the form in which data is stored in the database and
database should not worry about API contracts.

An important factor for keeping the main parts separate is to keep
the interfaces of the parts clean from implementation details.
Beware of database entity objects leaking to, or HTTP request /
response interfaces being used by domain logic functions.

## Example API calls (cURL)
- List events:
  ```bash
  curl --request GET \
    --url http://localhost:3000/api/v1/event/list
  ```
- Create event:
  ```bash
  curl --request POST \
    --url http://localhost:3000/api/v1/event \
    --header 'content-type: application/json' \
    --data '{
    	"name": "test-event",
    	"dates": [
    		"2025-03-17",
    		"2025-03-18"
    	]
    }'
  ```
- Show event:
  ```bash
  curl --request GET \
    --url http://localhost:3000/api/v1/event/67dab04e0617b56b9184bcf0
  ```
- Add votes
  ```bash
  curl --request POST \
    --url http://localhost:3000/api/v1/event/67dab04e0617b56b9184bcf0/vote \
    --header 'content-type: application/json' \
    --data '{
    	"name": "Dick",
    	"votes": [
    		"2025-03-18",
    		"2025-04-18"
    	]
    }'
  ```
- Show results
  ```bash
  curl --request GET \
    --url http://localhost:3000/api/v1/event/67dab04e0617b56b9184bcf0/results
  ```


## Quick start

### Setup
```bash
npm run install
```

### Run locally with external services
```bash
./scripts/run-local.sh
```

### Run development environment (external services mocked)
```bash
npm run start:dev
```

### Dependencies
- Docker
- Docker Compose
- NodeJS
- MongoDB
