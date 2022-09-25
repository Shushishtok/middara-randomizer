import { RESPEC_XP_COST } from "./consts.js";
import {
    calculateDisciplinesXpWorthForAdventurer,
    getAdventurersData,
    resetAdventurerDisciplines,
    spendXPForAdventurer,
    verifyAdventurerName,
    writeAdventurerDataToFile,
} from "./gameUtils.js";
import { AdventurerName } from "./interfaces/adventurers.js";

export function respec() {
    const adventurerName = process.argv[2] as AdventurerName;

    // Validate name
    const verified = verifyAdventurerName(adventurerName, "respec");
    if (!verified) return;

    const adventurersData = getAdventurersData();
    if (!adventurersData) return;

    const adventurerData = adventurersData[adventurerName];

    // calculate XP cost of all used disciplines
    let xpWorth = calculateDisciplinesXpWorthForAdventurer(adventurerData);
    console.log(`Got a total of ${xpWorth} XP`);

    let totalXp = adventurerData.xp + xpWorth;

    // Check if Adventurer has no XP to respec with
    if (totalXp < RESPEC_XP_COST) {
        console.log(`Adventurer has no XP to pay for respec costs. Aborting respec process`);
        return;
    }

    // reduce respec cost from XP
    totalXp -= RESPEC_XP_COST;

    // set XP
    adventurerData.xp = totalXp;
    console.log(`After paying respec costs, adventurer was refunded ${xpWorth} XP, having a total of ${totalXp} XP`);

    // Reset adventurer's disciplines
    resetAdventurerDisciplines(adventurerName, adventurerData);

    // spend XP for adventurer again
    spendXPForAdventurer(adventurerName, adventurersData);

    // write data to file
    writeAdventurerDataToFile(adventurersData);
}

respec();
