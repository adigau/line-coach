export type ScriptType = {
    id: string;
    type: string;
    title: string;
    lang: string;
    cast: CharacterType[];
    sections: SectionType[];
    groupIds: string[];
};

///// TEST 👇

export type CharacterStorage = {
    id: string;
    displayName: string;
};
export type SectionStorage = {
    id: string;
    displayName: string;
};
export type LineStorage = {
    id: string;
    sectionId: string;
    characterId: string;
    text: string;
};

///// TEST 👆

export type CharacterType = {
    id: string;
    displayName: string;
    isHighlighted?: boolean;
};

export type SectionType = {
    id: string;
    displayName: string;
    isDisplayed?: boolean;
    lines: LineType[];
};

export type LineType = {
    id: string;
    href?: string;
    characterId: string;
    text: string;
    character?: CharacterType;
};
