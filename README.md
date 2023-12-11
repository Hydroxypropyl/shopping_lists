# Project 1: Shared shopping list

To run the project without the tests, open a terminal at the root of the repository and run `docker compose up`.

To run the project with the Playwright tests, run `docker compose build && docker compose run --entrypoint=npx e2e-playwright playwright test && docker compose rm -sf`.

To access the online location, go to : https://shopping-list-yrr2.onrender.com
