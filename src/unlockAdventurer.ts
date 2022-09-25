import { AdventurerName } from "./interfaces/adventurers.js";
import { getAdventurersData, initAdventurer, verifyAdventurerName, writeAdventurerDataToFile } from "./gameUtils.js";

function unlockAdventurer() {
    // Get argument for adventurer name from process
    let adventurerName = process.argv[2] as AdventurerName;

    const verified = verifyAdventurerName(adventurerName, "unlock");
    if (!verified) return;

    const adventurersData = getAdventurersData();
    if (!adventurersData) return;

    // unlock adventurer
    if (adventurersData[adventurerName].unlocked) {
        console.log(`Adventurer ${adventurerName} is already unlocked!`);
        return;
    }
    adventurersData[adventurerName].unlocked = true;

    // init adventurer
    initAdventurer(adventurerName, adventurersData[adventurerName]);

    // write back to file
    writeAdventurerDataToFile(adventurersData);
    console.log(`Adventurer ${adventurerName} successfully unlocked!`);
}

unlockAdventurer();
