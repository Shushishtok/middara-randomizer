import { drawNewUniqueItem, getAdventuringPartyData, writeAdventuringPartyDataToFile } from "./gameUtils.js";

function startNewStoryRound() {
    const adventuringPartyData = getAdventuringPartyData();
    const uniqueItem = drawNewUniqueItem(adventuringPartyData);
    if (uniqueItem) {
        const [uniqueItemName] = uniqueItem;
        adventuringPartyData.uniqueItemInShop = uniqueItemName;
        console.log(`New story round's unique item in shop is: ${uniqueItemName}`);
    } else {
        adventuringPartyData.uniqueItemInShop = null;
        console.log("There was no unique item found, the shop in this Story Round will have no unique items");
    }

    writeAdventuringPartyDataToFile(adventuringPartyData);
}

startNewStoryRound();
