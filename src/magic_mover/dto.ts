import { MagicItemDTO } from "../magic_item/dto";
import { MagicMover, MagicMoverState } from "./model";

export class MagicMoverDTO {

    id: number;
    state: string;
    weightLimit: number;
    missions: number;
    energy: number;
    items: MagicItemDTO[];

    constructor(mover: MagicMover) {
        this.id = mover.id;
        this.state = MagicMoverState[mover.state];
        this.weightLimit = mover.weightLimit;
        this.missions = mover.missions;
        this.energy = mover.energy;
        this.items = mover.items.map(item => new MagicItemDTO(item));
    }
}

export class MagicMoverListDTO {
    id: number;
    missions: number;

    constructor(mover: MagicMover) {
        this.id = mover.id;
        this.missions = mover.missions;
    }
}
