# Magic Transporters
Dener Rosa's solution

## How to run
Install dependencies using NPM

    npm install

Run integration tests

    npm test

## Architecture

The app is built using **Express** and **winston** for logging.

Tests are done using **Jest** and **SuperTest**.

I created one endpoint for each bullet point in the task's overview. I used TDD, all data is set up within each test before I call the function under test. All data is cleared between tests.

Instead of grouping files by layer (`routers`, `controllers`, `models`) I decided to group by subject (`magic_item` and `magic_mover`). That's just personal preference.

In the interest of time, tests are not exhaustive. I'm also not using a database, since it was not a requirement. I'm just saving the entities in an array in memory.

## Endpoints

You can look at the helper functions at `test/integration.test.ts` to see examples of how to use the API.

Some CURL examples:

    curl -X POST http://localhost:3333/api/v1/magic_mover -H "Content-Type: application/json" -d '{"energy": 60, "weightLimit": 30}'

    curl -X GET http://localhost:3333/api/v1/magic_mover/most_missions