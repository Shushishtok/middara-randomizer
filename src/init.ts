import { getAdventurersData, getAdventuringPartyData, initAdventurer, writeAdventurerDataToFile, writeAdventuringPartyDataToFile } from "./gameUtils.js";
import { AdventurerName } from "./interfaces/adventurers.js";

function init() {
    initAllAdventurers();
    initParty();
    console.log("Initialization successful!");
}

function initAllAdventurers() {
    const adventurersData = getAdventurersData();

    for (const [adventurerName, adventurer] of Object.entries(adventurersData)) {
        initAdventurer(adventurerName as AdventurerName, adventurer);
    }

    writeAdventurerDataToFile(adventurersData);
}

function initParty() {
    const partyData = getAdventuringPartyData();
    writeAdventuringPartyDataToFile(partyData);
}

init();
