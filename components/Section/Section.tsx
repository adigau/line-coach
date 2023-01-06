import React from "react";
import { Line as LineComponent } from "../Line";
import styles from "./Section.module.css";
import {
    Character,
    Section,
    Line,
} from "../../types/script";

type SectionProps = {
    section: Section
    cast: Character[];
    isHiddenLines: boolean;
    isAnnotationMode: boolean;
    isAnnotationModeOnlyMine: boolean;
};

export function Section({
    section,
    cast,
    isHiddenLines,
    isAnnotationMode,
    isAnnotationModeOnlyMine
}: SectionProps) {

    const renderLine = (line: Line) => {

        return (
            <li key={line.id}>
                <LineComponent
                    line={line}
                    isHiddenLines={isHiddenLines}
                    isAnnotationMode={isAnnotationMode}
                    isAnnotationModeOnlyMine={isAnnotationModeOnlyMine}
                />
            </li>
        )
    }

    return (
        <div>
            <div className={styles.section} id={section.href} key={section.id}>
                <ul className={styles.linesul}>
                    {section.lines.map((line) => renderLine(line))}
                </ul>
            </div>
        </div>
    );
}