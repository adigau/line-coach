import React from "react";
import {
    Character,
    ScriptType,
    Section,
} from "../../types/script";
import { User } from "../../types";
import { Section as SectionComponent } from "../Section";

type ScriptProps = {
    script: ScriptType;
    cast: Character[];
    users: Omit<User, "color">[];
    searchTerm: string;
    isHiddenLines: boolean;
    isAnnotationMode: boolean;
    isAnnotationModeOnlyMine: boolean;
};

export function Script({
    script,
    searchTerm,
    cast,
    isHiddenLines,
    isAnnotationMode,
    isAnnotationModeOnlyMine }: ScriptProps) {

    const renderSections = (sections: Section[]) => {
        const sectionsToDisplay = sections
            .map((element) => {
                return {
                    ...element,
                    lines: element.lines.filter((subElement) => subElement.text.toLowerCase().includes(searchTerm.toLowerCase())
                    ),
                };
            })
            .filter((x) => x.lines.length > 0);

        return (<SectionComponent
            sections={sectionsToDisplay}
            cast={cast}
            isHiddenLines={isHiddenLines}
            isAnnotationMode={isAnnotationMode}
            isAnnotationModeOnlyMine={isAnnotationModeOnlyMine} />
        );
    };

    return <div>{renderSections(script.sections.filter((f) => f.isDisplayed))}</div>
}

