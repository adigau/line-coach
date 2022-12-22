import React from "react";
import { Line as LineComponent } from "../Line";
import styles from "./Section.module.css";
import {
    Character,
    Section,
    Line,
} from "../../types/script";
import { AnnotationType } from "../../types/storage";
import * as RadixSeparator from "@radix-ui/react-separator";

type SectionProps = {
    sections: Section[]
    cast: Character[];
    annotations: AnnotationType[];
    currentUserId: string;
    isHiddenLines: boolean;
    isAnnotationMode: boolean;
    isAnnotationModeOnlyMine: boolean;
    addOrUpdateAnnotation: Function;
};

export function Section({
    sections,
    cast,
    annotations,
    currentUserId,
    isHiddenLines,
    isAnnotationMode,
    isAnnotationModeOnlyMine,
    addOrUpdateAnnotation }: SectionProps) {

    const renderLine = (line: Line) => {
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
                <LineComponent
                    line={line}
                    currentUserId={currentUserId}
                    isHiddenLines={isHiddenLines}
                    isAnnotationMode={isAnnotationMode}
                    isAnnotationModeOnlyMine={isAnnotationModeOnlyMine}
                    currentUserAnnotation={currentUserAnnotation}
                    otherUsersAnnotations={otherUsersAnnotations}
                    onAddOrUpdateAnnotation={addOrUpdateAnnotation}
                />
            </li>
        )
    }

    return (
        <div>
            {sections.map((section, index) => {
                return (
                    <div key={section.id}>
                        <h2 className={styles.sectionName}>{section.displayName}</h2>
                        <ul className={styles.linesul}>
                            {section.lines.map((line) => renderLine(line))}
                        </ul>
                        {renderSeparator(sections.length, index)}
                    </div>
                );
            })}
        </div>
    );
}

function renderSeparator(numberOfSections: number, index: number) {
    return index >= numberOfSections - 1 ?
        (<></>) :
        (<div className={styles.separatorContainer}>
            <RadixSeparator.Root className={styles.separator} />
        </div>);
}