import { Adventurer, AdventurerName, AdventurersData } from "./interfaces/adventurers.js";
import { Discipline, DisciplineLevel, DisciplineName, DisciplineTree, DisciplineTreeLevels } from "./interfaces/disciplines.js";
import * as fs from "fs";
import {
    ADVENTURERS_DATA_FILE_PATH,
    DISCIPLINE_COST_INCREASE_PER_DISCIPLINE_SAME_LEVEL,
    DISCIPLINE_COST_LEVEL,
    DISCIPLINE_STOCKS,
    DISCIPLINE_TREES_PER_ADVENTUERER,
    MAX_DISCIPLINE_LEVEL,
} from "./consts.js";
import { disciplines } from "./data/disciplines.js";
import { getCountInArr, pickAndRemoveFromArray, pickOneFromArray } from "./generalUtils.js";

export function getAmountOfDisciplinesInStock(discipline: Discipline) {
    return DISCIPLINE_STOCKS[discipline.level];
}

export function verifyAdventurerName(adventurerName: AdventurerName, scriptName: string) {
    if (!adventurerName) {
        console.log("Adventurer name was not supplied.");
        console.log(`usage: npm run ${scriptName} Rook`);
        return false;
    }

    // Trim whitespaces
    adventurerName = adventurerName.trim() as AdventurerName;

    // Verify adventurer name is valid (compare with enum)
    if (!Object.values(AdventurerName).includes(adventurerName)) {
        console.log(
            `Could not find adventurer with name ${adventurerName}. Please verify it is one of the following names: ${JSON.stringify(
                Object.values(AdventurerName)
            )}.`
        );
        return false;
    }

    return true;
}

export function getAdventurersData() {
    // If adventurers file doesn't exist, exit with an error message
    if (!fs.existsSync(ADVENTURERS_DATA_FILE_PATH)) {
        console.log("Adventurers file could not be found. If you haven't initialized yet, run npm run init to create the file.");
        return null;
    }

    // Parse file
    const adventurersData = JSON.parse(fs.readFileSync(ADVENTURERS_DATA_FILE_PATH, "utf-8")) as AdventurersData;
    return adventurersData;
}

export function writeAdventurerDataToFile(adventurersData: AdventurersData) {
    const result = JSON.stringify(adventurersData, undefined, 4);
    fs.writeFileSync(ADVENTURERS_DATA_FILE_PATH, result);
}

export function getUsedDisciplines(adventurersData: AdventurersData): Discipline[] {
    const usedDisciplines: Discipline[] = [];

    for (const adventurerData of Object.values(adventurersData)) {
        usedDisciplines.push(...Object.values(adventurerData.disciplines));
    }

    return usedDisciplines;
}

export function getAvailableDisciplines(adventurersData: AdventurersData) {
    const usedDisciplines = getUsedDisciplines(adventurersData);

    const availableDisciplines = Object.entries(disciplines).filter(([disciplineName, discipline]) => {
        const timesUsed = usedDisciplines.filter((usedDiscipline) => usedDiscipline === discipline).length;
        return timesUsed < getAmountOfDisciplinesInStock(discipline);
    }) as [DisciplineName, Discipline][];

    return availableDisciplines;
}

export function getDisciplineBuyCost(level: DisciplineLevel, adventurer: Adventurer) {
    // get discipline cost
    const baseCost = DISCIPLINE_COST_LEVEL[level];
    const disciplinesInSameLevelCount = getCountInArr(Object.values(adventurer.disciplines), (discipline) => discipline.level === level);
    const disciplineCostIncrease = disciplinesInSameLevelCount * DISCIPLINE_COST_INCREASE_PER_DISCIPLINE_SAME_LEVEL;

    return baseCost + disciplineCostIncrease;
}

export function initAdventurer(adventurerName: AdventurerName, adventurer: Adventurer) {
    console.log(`Going through ${adventurerName}'s details`);
    // Ignore if not unlocked
    if (!adventurer.unlocked) {
        console.log(`Ignoring ${adventurerName} as they are not unlocked yet`);
        return;
    }

    // Ignore if it has chosenDisciplines (not undefined)
    if (adventurer.chosenDisciplineTrees !== undefined && adventurer.chosenDisciplineTrees.length > 0) {
        console.log(`Ignoring ${adventurerName} as they already have defined discipline trees`);
        return;
    }

    // Select two random disciplines, removing it from the array each time
    const disciplineTrees = Object.values(DisciplineTree);
    adventurer.chosenDisciplineTrees = [];
    for (let index = 0; index < DISCIPLINE_TREES_PER_ADVENTUERER; index++) {
        adventurer.chosenDisciplineTrees.push(pickAndRemoveFromArray(disciplineTrees));
    }

    // Print the adventurer and his chosen disciplines
    console.log(`Adventurer ${adventurerName} was assigned the disciplines: ${JSON.stringify(adventurer.chosenDisciplineTrees)}`);
}

export function resetAdventurerDisciplines(adventurerName: AdventurerName, adventurer: Adventurer) {
    adventurer.chosenDisciplineTrees = [];
    adventurer.disciplines = {};
    initAdventurer(adventurerName, adventurer);
}

export function spendXPForAdventurer(adventurerName: AdventurerName, adventurersData: AdventurersData, availableDisciplines?: [DisciplineName, Discipline][]) {
    const adventurerData = adventurersData[adventurerName];

    if (!adventurerData.unlocked) return;

    if (!adventurerData.chosenDisciplineTrees) {
        console.log(`Adventurer ${adventurerName} has no chosen discipline trees!`);
        console.log("Please initialize the adventurer using npm run init");
        return;
    }

    if (!availableDisciplines) {
        availableDisciplines = getAvailableDisciplines(adventurersData);
    }

    console.log("==========================");

    console.log(`Checking for disciplines to spend XP for adventurer ${adventurerName}`);
    let boughtNewDisciplines = false;
    let attempts = 0;

    // Repeat forever until breaking out of the loop due to no more afforable disciplines
    while (attempts < 10) {
        const disciplineTreeLevels: DisciplineTreeLevels = {};
        const adventurerChosenDisciplines = [...adventurerData.chosenDisciplineTrees];

        // Get the highest level of each discipline tree it currently has
        for (const disciplineTree of adventurerChosenDisciplines) {
            let level = 0;
            for (const discipline of Object.values(adventurerData.disciplines)) {
                if (discipline.tree !== disciplineTree) continue;
                if (discipline.level > level) level = discipline.level;
            }

            // If level is max level, then get random level from the affordable range
            if (level === MAX_DISCIPLINE_LEVEL) {
                let affordableLevels = [...Array(MAX_DISCIPLINE_LEVEL).keys()].map((num) => num + 1) as DisciplineLevel[];
                affordableLevels = affordableLevels.filter((level) => adventurerData.xp >= getDisciplineBuyCost(level, adventurerData));
                level = pickOneFromArray(affordableLevels);
            } else {
                // Set the level one higher in order to buy a higher level discipline
                level = level + 1;
            }

            if (level === undefined) {
                console.log(`Cannot buy anything for discipline tree ${disciplineTree}, removing it from the list`);
                adventurerChosenDisciplines.splice(adventurerChosenDisciplines.indexOf(disciplineTree), 1);
                continue;
            }

            disciplineTreeLevels[disciplineTree] = level;
        }

        if (adventurerChosenDisciplines.length === 0) {
            console.log(`Could not find any affordable disciplines from any level on all discipline trees`);
            break;
        }

        // filter any discipline trees where buying next level would cost more than current XP
        const affordableDisciplineTrees = adventurerChosenDisciplines.filter((key) => {
            const disciplineLevel = disciplineTreeLevels[key] as DisciplineLevel;
            return adventurerData.xp >= getDisciplineBuyCost(disciplineLevel, adventurerData);
        });

        // Choose a discipline tree out of possible discipline trees, if any
        const chosenDisciplineTree = pickOneFromArray(affordableDisciplineTrees);
        if (!chosenDisciplineTree) {
            if (boughtNewDisciplines) {
                console.log(`Adventurer ${adventurerName} has no more affordable disciplines trees.`);
            } else {
                console.log(`Adventurer ${adventurerName} did not have any affordable discipline trees to buy new disciplines from.`);
            }
            break;
        }

        // Add a random discipline in that discipline tree in the chosen level
        const relevantDisciplines = availableDisciplines.filter(([disciplineName, discipline]) => {
            return discipline.tree === chosenDisciplineTree && discipline.level === disciplineTreeLevels[chosenDisciplineTree];
        });

        if (relevantDisciplines.length === 0) {
            console.log(
                `Could not find relevant disciplines for the chosen discipline tree ${chosenDisciplineTree} at level ${disciplineTreeLevels[chosenDisciplineTree]}.`
            );
            attempts++;
            continue;
        }

        // Remove chosen discipline from available disciplines pool
        const [chosenDiscipline] = availableDisciplines.splice(availableDisciplines.indexOf(pickOneFromArray(relevantDisciplines)), 1);
        const [chosenDisciplineName, chosenDisciplineData] = chosenDiscipline;
        console.log(`Chosen discipline name: ${chosenDisciplineName}`);

        // spend XP
        adventurerData.xp -= getDisciplineBuyCost(chosenDisciplineData.level, adventurerData);
        adventurerData.disciplines[chosenDisciplineName] = chosenDisciplineData;

        boughtNewDisciplines = true;
    }
}

export function getDisciplineBaseWorth(discipline: Discipline) {
    return DISCIPLINE_COST_LEVEL[discipline.level];
}

export function calculateDisciplinesXpWorthForAdventurer(adventurerData: Adventurer) {
    let totalDisciplinesWorth = 0;
    const disciplineLevelCounter: { [key: number]: number } = {};

    for (const discipline of Object.values(adventurerData.disciplines)) {
        const baseWorth = getDisciplineBaseWorth(discipline);
        const addedWorth = (disciplineLevelCounter[discipline.level] ?? 0) * DISCIPLINE_COST_INCREASE_PER_DISCIPLINE_SAME_LEVEL;
        const totalWorth = baseWorth + addedWorth;
        totalDisciplinesWorth += totalWorth;

        disciplineLevelCounter[discipline.level] = (disciplineLevelCounter[discipline.level] ?? 0) + 1;
    }

    return totalDisciplinesWorth;
}
