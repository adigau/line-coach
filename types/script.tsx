export type ScriptType = {
    id: string;
    cast: Character[];
    sections: Section[];
    groupIds: string[];
};

export type CharacterStorage = {
    id: string;
    displayName: string;
}
export interface Character extends CharacterStorage {
    isHighlighted: boolean;
}
export type SectionStorage = {
    id: string;
    displayName: string;
}
export interface Section extends SectionStorage {
    isDisplayed: boolean;
    lines: Line[];
}
export type LineStorage = {
    id: string;
    sectionId: string;
    characterId: string;
    text: string;
}
export interface Line extends LineStorage {
    href: string;
    character: Character;
}