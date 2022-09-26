import { Rarity } from "../interfaces/item.js";
import { AdventuringParty } from "../interfaces/party.js";

export const initialPartyData: AdventuringParty = {
    gold: 0,
    uniqueItemInShop: null,
    lootLevel: Rarity.MUNDANE,
    items: {},
};
