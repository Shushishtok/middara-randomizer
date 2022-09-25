import { NonEmptyArray } from "./interfaces/general";

export function getCountInArr<T>(arr: T[], callback: (value: T) => boolean): number {
    let count = 0;

    arr.forEach((value) => {
        if (callback(value)) count++;
    });

    return count;
}

export function returnStringAsBoolean(str: string) {
    const lowerCaseStr = str.toLowerCase();
    if (lowerCaseStr !== "true" && lowerCaseStr !== "false") {
        console.log(`Provided value ${str} was neither evaluated to true or false`);
        console.log("Please enter a true or false value");
        return null;
    }

    return lowerCaseStr === "true";
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickOneFromArray<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function pickAndRemoveFromArray<T>(arr: T[]) {
    const chosenIndex = Math.floor(Math.random() * arr.length);
    const item = arr.splice(chosenIndex, 1)[0];
    return item;
}
