import { MagicItem } from "../magic_item/model"

export enum MagicMoverState {
    RESTING,
    LOADING,
    ON_MISSION,
    DONE
}

let id = 0;

export class MagicMover {

    id = id++;
    state = MagicMoverState.RESTING;
    missions = 0;
    items: MagicItem[] = [];

    constructor(public weightLimit: number, public energy: number) { }

    getCurrentWeight() {
        return this.items.reduce((weight, item) => weight + item.weight, 0);
    }
}

const MAGIC_MOVERS: MagicMover[] = []

export function getMagicMoverById(id: number) {
    return MAGIC_MOVERS.find(mover => mover.id === id);
}

export function getMagicMovers() {
    return MAGIC_MOVERS;
}

export function addMagicMover(mover: MagicMover) {
    return MAGIC_MOVERS.push(mover);
}

export function resetMagicMovers() {
    MAGIC_MOVERS.splice(0, MAGIC_MOVERS.length);
    id = 0;
}