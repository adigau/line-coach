import { DocumentLanguage } from "./document";

export type ScriptType = {
    id: string;
    cast: Character[];
    sections: Section[];
    groupIds: string[];
    lang: DocumentLanguage;
    type: DocumentType;
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
    lines: Line[];
    href: string;
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