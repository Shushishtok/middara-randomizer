import { getAdventurersData, getAvailableDisciplines, spendXPForAdventurer, writeAdventurerDataToFile } from "./gameUtils.js";
import { AdventurerName, AdventurersData } from "./interfaces/adventurers.js";

function shopAndTrain() {
    // If adventurers file doesn't exist, exit with an error message
    const adventurersData = getAdventurersData();
    if (!adventurersData) return;

    spendXP(adventurersData);
    writeAdventurerDataToFile(adventurersData);
}

function spendXP(adventurersData: AdventurersData) {
    // Generate list of disciplines that can be given to adventurers
    const availableDisciplines = getAvailableDisciplines(adventurersData);

    // For each adventurer:
    for (const adventurerName of Object.keys(adventurersData)) {
        spendXPForAdventurer(adventurerName as AdventurerName, adventurersData, availableDisciplines);
    }
}

shopAndTrain();
