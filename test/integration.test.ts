import request from "supertest";
import { app } from "../src/app";
import { resetData } from "../src/utils/reset";

afterEach(() => {
    resetData();
});

//#region Helper functions
function addMagicMover(weightLimit: number, energy: number) {
    return request(app)
        .post("/api/v1/magic_mover")
        .set("content-type", "application/json")
        .send({
            weightLimit,
            energy
        });
}

function addMagicItem(name: string, weight: number) {
    return request(app)
        .post("/api/v1/magic_item")
        .set("content-type", "application/json")
        .send({
            name,
            weight
        });
}

function loadItems(id: number, items: number[]) {
    return request(app)
        .post(`/api/v1/magic_mover/${id}/load`)
        .set("content-type", "application/json")
        .send({
            items
        });
}

function startMission(id: number) {
    return request(app)
        .post(`/api/v1/magic_mover/${id}/start_mission`)
        .set("content-type", "application/json")
        .send();
}

function endMission(id: number) {
    return request(app)
        .post(`/api/v1/magic_mover/${id}/end_mission`)
        .set("content-type", "application/json")
        .send();
}

function listMoversWhoCompletedMostMissions() {
    return request(app)
        .get(`/api/v1/magic_mover/most_missions`)
        .set("content-type", "application/json")
        .send();
}

async function fullMission(id: number, items: { name: string, weight: number }[]) {
    const promises = items.map(item => addMagicItem(item.name, item.weight));
    const responses = await Promise.all(promises);
    const itemsIds = responses.map(response => response.body.id);

    const loadItemsResponse = await loadItems(id, itemsIds);
    expect(loadItemsResponse.status).toEqual(200);
    const startMissionResponse = await startMission(id);
    expect(startMissionResponse.status).toEqual(200);
    const endMissionResponse = await endMission(id);
    expect(endMissionResponse.status).toEqual(200);
}
//#endregion

describe("Magic Transporters happy path", () => {

    it("Add a Magic Mover, return 201 and the mover", async () => {
        const response = await addMagicMover(10, 11);

        expect(response.status).toEqual(201);
        expect(response.body).toMatchObject({
            state: "RESTING",
            energy: 11,
            missions: 0,
            items: [],
            weightLimit: 10
        });
    });

    it("Add a Magic Item, return 201 and the item", async () => {
        const response = await addMagicItem("My item", 10);

        expect(response.status).toEqual(201);
        expect(response.body).toMatchObject({
            name: "My item",
            weight: 10
        });
    });

    it("Load a Magic Mover with items, return 200 and the mover", async () => {
        const item1 = await addMagicItem("My item 1", 10);
        expect(item1.status).toEqual(201);
        const item2 = await addMagicItem("My item 2", 15);
        expect(item2.status).toEqual(201);
        const mover = await addMagicMover(30, 60);
        expect(mover.status).toEqual(201);

        const response = await loadItems(mover.body.id, [item1.body.id, item2.body.id]);

        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
            id: mover.body.id,
            state: "LOADING",
            items: [
                { id: item1.body.id, name: "My item 1", weight: 10 },
                { id: item2.body.id, name: "My item 2", weight: 15 }
            ]
        });
    });

    it("Start a Mission - update the Magic Mover's state to on a mission, return 200 and the mover", async () => {
        const item1 = await addMagicItem("My item", 10);
        expect(item1.status).toEqual(201);
        const mover = await addMagicMover(30, 60);
        expect(mover.status).toEqual(201);
        const loadItemsResponse = await loadItems(mover.body.id, [item1.body.id]);
        expect(loadItemsResponse.status).toEqual(200);

        const response = await startMission(mover.body.id);

        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
            id: mover.body.id,
            state: "ON_MISSION",
            energy: 50,
            items: [
                { id: item1.body.id, name: "My item", weight: 10 }
            ]
        });
    });

    it("End a Mission, return 200 and the mover", async () => {
        const item1 = await addMagicItem("My item 1", 10);
        expect(item1.status).toEqual(201);
        const mover = await addMagicMover(30, 60);
        expect(mover.status).toEqual(201);
        const loadItemsResponse = await loadItems(mover.body.id, [item1.body.id]);
        expect(loadItemsResponse.status).toEqual(200);
        const startMissionResponse = await startMission(mover.body.id);
        expect(startMissionResponse.status).toEqual(200);

        const response = await endMission(mover.body.id);

        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
            id: mover.body.id,
            missions: 1,
            state: "DONE",
            items: []
        });
    });

    it("Make a simple list showing who completed the most missions", async () => {
        const mover1 = await addMagicMover(30, 60);
        expect(mover1.status).toEqual(201);
        const mover1Id: number = mover1.body.id;
        await fullMission(mover1Id, [
            { name: "My item 1", weight: 15 },
            { name: "My item 2", weight: 15 }
        ]);

        const mover2 = await addMagicMover(30, 60);
        expect(mover2.status).toEqual(201);
        const mover2Id: number = mover2.body.id;
        await fullMission(mover2Id, [
            { name: "My item 3", weight: 17 },
            { name: "My item 4", weight: 5 }
        ]);
        await fullMission(mover2Id, [
            { name: "My item 5", weight: 20 }
        ]);
        await fullMission(mover2Id, [
            { name: "My item 6", weight: 10 }
        ]);

        const mover3 = await addMagicMover(30, 60);
        expect(mover3.status).toEqual(201);
        const mover3Id: number = mover3.body.id;
        await fullMission(mover3Id, [
            { name: "My item 7", weight: 10 }
        ]);
        await fullMission(mover3Id, [
            { name: "My item 8", weight: 10 }
        ])

        const response = await listMoversWhoCompletedMostMissions();

        expect(response.status).toEqual(200);
        expect(response.body).toEqual([
            { id: mover2Id, missions: 3 },
            { id: mover3Id, missions: 2 },
            { id: mover1Id, missions: 1 }
        ]);
    });
});

describe("Magic Transporters failure cases", () => {

    it("Add a Magic Mover with no weight limit, return 422", async () => {
        const response = await request(app)
            .post("/api/v1/magic_mover")
            .set("content-type", "application/json")
            .send({});

        expect(response.status).toEqual(422);
    });

    it("Load a Magic Mover with repeated items, return 422", async () => {
        const item = await addMagicItem("My item", 10);
        expect(item.status).toEqual(201);
        const mover = await addMagicMover(30, 60);
        expect(mover.status).toEqual(201);
        const loadItemsResponse = await loadItems(mover.body.id, [item.body.id]);
        expect(loadItemsResponse.status).toEqual(200);

        const response = await loadItems(mover.body.id, [item.body.id]);

        expect(response.status).toEqual(422);
    });

    it("Deplete a Magic Mover's energy, return 422", async () => {
        const mover = await addMagicMover(5, 9);
        expect(mover.status).toEqual(201);
        const moverId: number = mover.body.id;
        await fullMission(moverId, [{ name: "My item 1", weight: 5 }]);
        const item = await addMagicItem("My item 2", 5);

        const response = await loadItems(mover.body.id, [item.body.id]);

        expect(response.status).toEqual(422);
    });

    it("Start a Mission - stop loading more, return 422", async () => {
        const item1 = await addMagicItem("My item 1", 10);
        expect(item1.status).toEqual(201);
        const item2 = await addMagicItem("My item 2", 15);
        const mover = await addMagicMover(30, 60);
        expect(mover.status).toEqual(201);
        const loadItemsResponse = await loadItems(mover.body.id, [item1.body.id]);
        expect(loadItemsResponse.status).toEqual(200);
        const startMissionResponse = await startMission(mover.body.id);
        expect(startMissionResponse.status).toEqual(200);

        const response = await loadItems(mover.body.id, [item2.body.id]);

        expect(response.status).toEqual(422);
    });
})