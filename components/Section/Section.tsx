import React, { useEffect, useState } from "react";
import { Line as LineComponent } from "../Line";
import styles from "./Section.module.css";
import {
    Character,
    Section,
    Line,
} from "../../types/script";
import { Button } from "../../primitives/Button";
import { PracticeDialog } from "../PracticeDialog";
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { DocumentLanguage } from "../../types";

type SectionProps = {
    section: Section;

    isHiddenLines: boolean;
    isAnnotationMode: boolean;
    isAnnotationModeOnlyMine: boolean;
    lang: DocumentLanguage;
};

export function Section({
    section,
    isHiddenLines,
    isAnnotationMode,
    isAnnotationModeOnlyMine,
    lang,
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
            <PracticeDialog title={"Practicing: " + section.displayName} section={section} lang={lang}>
                <Button icon={<HeadsetMicIcon />}>Practice</Button>
            </PracticeDialog>
            <div className={styles.section} id={section.href} key={section?.id}>
                <ul className={styles.linesul}>
                    {section.lines.map((line) => renderLine(line))}
                </ul>
            </div>
        </div>
    );
}