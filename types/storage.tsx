import { User } from "./data";

export type NoteStorage = {
    userId: string;
    lineId: string;
    text: string;
}
export interface Note extends NoteStorage {
    user: User;
    key: string
}

export type CharacterSelectionStorage = {
    userId: string;
    characterIds: string[];
}
export interface CharacterSelection extends CharacterSelectionStorage {
    user: User;
}

export type SectionSelectionStorage = {
    userId: string;
    hiddenSectionIds: string[];
}
export interface SectionSelection extends SectionSelectionStorage {
    user: User;
}

export type OptionsSelectionStorage = {
    userId: string;
    isHiddenLines: boolean;
    isAnnotationMode: boolean;
    isAnnotationModeOnlyMine: boolean;
}
export interface OptionsSelection extends OptionsSelectionStorage {
    user: User;
}
