import { HTTPError } from "../utils/errors";
import { LOGGER } from "../utils/logger";
import { getMagicItemsById } from "../magic_item/model";
import { MagicMover, MagicMoverState, addMagicMover, getMagicMoverById, getMagicMovers } from "./model";

export function add(weightLimit: number, energy: number) {
    const mover = new MagicMover(weightLimit, energy);
    addMagicMover(mover);
    return mover;
}

export function loadItems(id: number, itemsIds: number[]) {
    LOGGER.log('info', "Loading Magic Mover with items", { id, itemsIds });
    const mover = getMagicMoverById(id);
    if (!mover) {
        throw new HTTPError(404, "Magic Mover not found", { id });
    }
    if (mover.state === MagicMoverState.ON_MISSION) {
        throw new HTTPError(422, "Cannot load items to a Magic Mover that is on a mission", { mover, itemsIds });
    }

    const items = getMagicItemsById(itemsIds);

    if (mover.items.some(item => items.includes(item))) {
        throw new HTTPError(422, "Cannot load items that the Magic Mover already has", { mover, items });
    }

    const currentWeight = mover.getCurrentWeight();
    const itemsWeight = items.reduce((weight, item) => weight + item.weight, 0);
    if (mover.weightLimit - currentWeight < itemsWeight) {
        throw new HTTPError(422, "Magic Mover cannot carry the items because it would exceed the weight limit", { currentWeight, itemsWeight, mover, items });
    }
    if (mover.energy - itemsWeight < 0) {
        throw new HTTPError(422, "Magic Mover cannot carry the items because it doesn't have enough energy", { currentWeight, itemsWeight, mover, items });
    }

    mover.state = MagicMoverState.LOADING;
    mover.items.push(...items);
    LOGGER.log('info', "Loaded Magic Mover with items", { id, items });
    return mover;
}

export function startMission(id: number) {
    LOGGER.log('info', "Starting Magic Mover's mission", { id });
    const mover = getMagicMoverById(id);
    if (!mover) {
        throw new HTTPError(404, "Magic Mover not found", { id });
    }

    mover.state = MagicMoverState.ON_MISSION;
    mover.energy -= mover.getCurrentWeight();
    LOGGER.log('info', "Magic Mover is now on a mission", { mover });
    return mover;
}

export function endMission(id: number) {
    LOGGER.log('info', "Ending Magic Mover's mission", { id });
    const mover = getMagicMoverById(id);
    if (!mover) {
        throw new HTTPError(404, "Magic Mover not found", { id });
    }

    if (mover.state !== MagicMoverState.ON_MISSION) {
        throw new HTTPError(422, "Cannot end a mission of a Magic Mover that is not on a mission", { mover });
    }

    mover.state = MagicMoverState.DONE;
    mover.missions++;
    mover.items = [];
    LOGGER.log('info', "Magic Mover is now done", { mover });
    return mover;
}

export function listMoversWhoCompletedMostMissions() {
    const movers = getMagicMovers();
    movers.sort((a, b) => b.missions - a.missions);
    return movers;
}