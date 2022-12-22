import React from "react";
import {
    Character,
    ScriptType,
    Section,
} from "../../types/script";
import { AnnotationStorage } from "../../types/storage";
import { User } from "../../types";
import { Section as SectionComponent } from "../Section";

type ScriptProps = {
    script: ScriptType;
    cast: Character[];
    annotations: AnnotationStorage[];
    users: Omit<User, "color">[];
    searchTerm: string;
    currentUserId: string;
    isHiddenLines: boolean;
    isAnnotationMode: boolean;
    isAnnotationModeOnlyMine: boolean;
    addOrUpdateAnnotation: Function;
};

export function Script({
    script,
    searchTerm,
    cast,
    annotations,
    addOrUpdateAnnotation,
    currentUserId,
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
            annotations={annotations}
            addOrUpdateAnnotation={addOrUpdateAnnotation}
            currentUserId={currentUserId}
            isHiddenLines={isHiddenLines}
            isAnnotationMode={isAnnotationMode}
            isAnnotationModeOnlyMine={isAnnotationModeOnlyMine} />
        );
    };

    return <div>{renderSections(script.sections.filter((f) => f.isDisplayed))}</div>
}

