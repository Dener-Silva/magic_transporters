import { resetMagicItems } from "../magic_item/model";
import { resetMagicMovers } from "../magic_mover/model";

export function resetData() {
    resetMagicMovers();
    resetMagicItems();
}