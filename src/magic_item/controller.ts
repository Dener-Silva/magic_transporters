import { MagicItem, addMagicItem } from "./model";

export function add(name: string, weight: number) {
    const item = new MagicItem(name, weight);
    addMagicItem(item);
    return item;
}