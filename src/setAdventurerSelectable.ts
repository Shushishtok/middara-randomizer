import { AdventurerName } from "./interfaces/adventurers.js";
import { getAdventurersData, verifyAdventurerName, writeAdventurerDataToFile } from "./gameUtils.js";
import { returnStringAsBoolean } from "./generalUtils.js";

function setAdventurerSelectable() {
    // Get argument for adventurer name from process
    let adventurerName = process.argv[2] as AdventurerName;
    let selectable = process.argv[3];

    if (!selectable || selectable === "") {
        console.log("Argument for whether to set selectable not provided.");
        console.log("Usage: npm run set-selectable Rook true");
        return;
    }

    const setSelectable = returnStringAsBoolean(selectable);
    if (setSelectable === null) return;

    const verified = verifyAdventurerName(adventurerName, "setSelectable");
    if (!verified) return;

    const adventurersData = getAdventurersData();
    if (!adventurersData) return;

    if (adventurersData[adventurerName].selectable === setSelectable) {
        console.log(`Adventurer ${adventurerName} is already ${setSelectable ? "selectable" : "unselectable"}!`);
        return;
    }
    adventurersData[adventurerName].selectable = setSelectable;

    // write back to file
    writeAdventurerDataToFile(adventurersData);
    console.log(`Adventurer ${adventurerName} successfully became ${setSelectable ? "selectable" : "unselectable"}!`);
}

setAdventurerSelectable();
