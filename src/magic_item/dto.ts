import { MagicItem } from "./model";

export class MagicItemDTO {

    id: number;
    name: string;
    weight: number;

    constructor(item: MagicItem) {
        this.id = item.id;
        this.name = item.name;
        this.weight = item.weight;
    }
}