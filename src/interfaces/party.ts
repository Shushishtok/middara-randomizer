import { Item, ItemData, ItemName, Rarity } from "./item";

export interface AdventuringParty {
    gold: number;
    lootLevel: Rarity;
    uniqueItemInShop: ItemName | null;
    items: Partial<ItemData>;
}
