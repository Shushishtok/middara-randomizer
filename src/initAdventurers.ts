import * as fs from "fs";
import { ADVENTURERS_DATA_FILE_PATH } from "./consts.js";
import { initialAdventurersData } from "./data/initialAdventurersData.js";
import { initAdventurer, writeAdventurerDataToFile } from "./gameUtils.js";
import { AdventurerName, AdventurersData } from "./interfaces/adventurers.js";

function initAllAdventurers() {
    const adventurerDataObject = fs.existsSync(ADVENTURERS_DATA_FILE_PATH)
        ? (JSON.parse(fs.readFileSync(ADVENTURERS_DATA_FILE_PATH, "utf-8")) as AdventurersData)
        : initialAdventurersData;

    for (const [adventurerName, adventurer] of Object.entries(adventurerDataObject)) {
        initAdventurer(adventurerName as AdventurerName, adventurer);
    }

    writeAdventurerDataToFile(adventurerDataObject);
}

initAllAdventurers();
