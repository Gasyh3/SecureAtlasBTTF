.PHONY: up down build clean logs

up:
	docker-compose up -d --build

down:
	docker-compose down

build:
	docker-compose build

clean:
	docker-compose down -v --rmi all

logs:
	docker-compose logs -f 