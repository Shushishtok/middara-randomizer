import { getAdventurersData, writeAdventurerDataToFile } from "./gameUtils.js";

function addExperience() {
    const experienceStr = process.argv[2];
    if (!experienceStr) {
        console.log(`Experience was not provided. Please provide the amount of experience as an argument Example usage: npm run add-xp 5`);
    }

    const experience = Number(experienceStr);
    if (Number.isNaN(experience)) {
        console.log(`Experience was not a numeric value. Example usage: npm run add-xp 5`);
    }

    const adventurersData = getAdventurersData();
    if (!adventurersData) return;

    for (const adventurer of Object.values(adventurersData)) {
        adventurer.xp += experience;
    }

    writeAdventurerDataToFile(adventurersData);
}

addExperience();
