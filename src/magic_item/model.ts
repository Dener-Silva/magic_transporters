let id = 0;

export class MagicItem {
    id = id++;
    constructor(public name: string, public weight: number) { }
}

const MAGIC_ITEMS: MagicItem[] = [];

export function addMagicItem(item: MagicItem) {
    MAGIC_ITEMS.push(item);
}

export function getMagicItemsById(ids: number[]) {
    return MAGIC_ITEMS.filter(item => ids.includes(item.id));
}

export function resetMagicItems() {
    MAGIC_ITEMS.splice(0, MAGIC_ITEMS.length);
    id = 0;
}