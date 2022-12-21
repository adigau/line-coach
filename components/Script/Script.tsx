import React from "react";
import { Line } from "../Line";
import styles from "./Script.module.css";
import {
    ScriptType,
    SectionType,
    LineType,
    CharacterType,
} from "../../types/script";
import { AnnotationType } from "../../types/storage";
import { User } from "../../types";
import * as RadixSeparator from "@radix-ui/react-separator";

type ScriptProps = {
    script: ScriptType;
    cast: CharacterType[];
    annotations: AnnotationType[];
    users: Omit<User, "color">[];
    searchTerm: string;
    currentUserId: string;
    isHiddenLines: boolean;
    isAnnotationMode: boolean;
    isAnnotationModeOnlyMine: boolean;
    isDisplayPresenceMode: boolean;
    addOrUpdateAnnotation: Function;
};

export function Script({
    script,
    searchTerm,
    cast,
    annotations,
    currentUserId,
    isHiddenLines,
    isAnnotationMode,
    isAnnotationModeOnlyMine,
    isDisplayPresenceMode,
    addOrUpdateAnnotation }: ScriptProps) {
    let lineIncrement = 0;

    const onAddOrUpdateAnnotation = (annotation: AnnotationType) =>
        addOrUpdateAnnotation(annotation);

    const renderSections = (sections: SectionType[]) => {
        const sectionsToDisplay = sections
            .map((element) => {
                return {
                    ...element,
                    matchingLines: element.lines.filter((subElement) =>
                        subElement.text.toLowerCase().includes(searchTerm.toLowerCase())
                    ),
                };
            })
            .filter((x) => x.matchingLines.length > 0);
        return (
            <div>
                {sectionsToDisplay.map((section, index) => {
                    return (
                        <div key={section.id}>
                            <h2 className={styles.sectionName}>{section.displayName}</h2>
                            <ul className={styles.linesul}>
                                {section.matchingLines.map((line) => {
                                    const newIncrementValue = lineIncrement;
                                    lineIncrement = newIncrementValue + 1;
                                    return renderLine(line);
                                })}
                            </ul>
                            {renderSeparator(sectionsToDisplay.length, index)}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderLine = (line: LineType) => {
        const currentCharacter = cast.filter((character) => {
            return character.id == line.characterId;
        })[0];
        const lineAnnotations = annotations.filter(
            (annotation) => annotation.lineId == line.id
        );
        const currentUserAnnotation = lineAnnotations.filter(
            (annotation) => annotation.userId == currentUserId
        )[0];
        const otherUsersAnnotations = lineAnnotations.filter(
            (annotation) => annotation.userId != currentUserId
        );

        if (line.character != null) {
            line.character.displayName = currentCharacter.displayName;
            line.character.isHighlighted = currentCharacter.isHighlighted;
        }

        return (
            <li key={line.id}>
                <Line
                    line={line}
                    currentUserId={currentUserId}
                    isHiddenLines={isHiddenLines}
                    isAnnotationMode={isAnnotationMode}
                    isAnnotationModeOnlyMine={isAnnotationModeOnlyMine}
                    isDisplayPresenceMode={isDisplayPresenceMode}
                    currentUserAnnotation={currentUserAnnotation}
                    otherUsersAnnotations={otherUsersAnnotations}
                    onAddOrUpdateAnnotation={onAddOrUpdateAnnotation}
                />
            </li>
        );
    };

    return (
        <>
            <div>{renderSections(script.sections.filter((f) => f.isDisplayed))}</div>
        </>
    );
}

function renderSeparator(numberOfSections: number, index: number) {
    if (index >= numberOfSections - 1) return <></>;

    return (
        <div className={styles.separatorContainer}>
            <RadixSeparator.Root className={styles.separator} />
        </div>
    );
}
