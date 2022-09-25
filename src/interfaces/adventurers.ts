import { DisciplineData, DisciplineTree } from "./disciplines.js";
import { TwoElementsArray } from "./general.js";

export enum AdventurerName {
    ZEKE = "Zeke",
    ROOK = "Rook",
    NIGHTINGALE = "Nightingale",
    REMI = "Remi",
    PADRAIC = "Padraic",
    SHAYLISS = "Shayliss",
    DAMOCLES = "Damocles",
    ZAFIR = "Zafir",
}

export interface Adventurer {
    chosenDisciplineTrees: DisciplineTree[] | undefined;
    unlocked: boolean;
    selectable: boolean;
    xp: number;
    disciplines: Partial<DisciplineData>;
}

export type AdventurersData = {
    [key in AdventurerName]: Adventurer;
};
