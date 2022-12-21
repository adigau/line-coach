import { User } from "./data";

export type AnnotationType = {
    key: string;
    userId: string;
    lineId: string;
    text: string;
    user?: User;
};

export type CharacterSelectionType = {
    userId: string;
    user?: User;
    characterIds: string[];
};

export type SectionSelectionType = {
    userId: string;
    hiddenSectionIds: string[];
};

export type OptionsSelectionType = {
    userId: string;
    isHiddenLines: boolean;
    isAnnotationMode: boolean;
    isAnnotationModeOnlyMine: boolean;
    isDisplayPresenceMode: boolean;
};
