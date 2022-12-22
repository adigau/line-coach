import React, { useEffect, useState } from "react";
import { Line as LineComponent } from "../Line";
import styles from "./Section.module.css";
import {
    Character,
    Section,
    Line,
} from "../../types/script";
import { AnnotationType, CharacterSelectionType } from "../../types/storage";
import * as RadixSeparator from "@radix-ui/react-separator";
import { useOthers, useSelf, useStorage } from "../../liveblocks.config";
import { shallow } from "@liveblocks/client";
import { User } from "../../types";

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
    const self = useSelf()
    const others = useOthers()

    const othersCharacterSelections: CharacterSelectionType[] = useStorage(
        root => Array.from(root.characterSelections.values()).filter((x) => x.userId != self.id && others.some(y => y.id == x.userId)),
        shallow,
    );

    const [charactersToWatchers, setCharactersToWatchers] = useState<Map<string, (User | null)[]>>()

    useEffect(() => {
        const fetchData = () => {
            const tempWatchers = new Map<string, (User | null)[]>()
            cast.map(x => {
                const id = x.id
                const watchers = othersCharacterSelections
                    .filter(y => y.characterIds.some(z => z == x.id))
                    .map(x => {
                        const user = others.filter(y => y.id == x.userId)[0]
                        return { id: user.id, name: user.info.name, avatar: user.info.avatar } as User
                    })
                tempWatchers.set(id, watchers)
            })

            setCharactersToWatchers(tempWatchers)
        }
        fetchData();
    }, [cast, othersCharacterSelections, others])

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

    function onlyUniqueCharacterIds(value: { characterId: string, displayName: string }, index: number, self: { characterId: string, displayName: string }[]) {
        return self.indexOf(value) === index;
    }

    function isCharacterOnline(characterId: string): boolean {
        if (charactersToWatchers == null)
            return false
        const onlineUsers = charactersToWatchers.get(characterId);
        return onlineUsers != null && onlineUsers.length > 0
    }

    const displayPresenceIndicatorSection = (sectionId: string) => {
        if (charactersToWatchers == null)
            return

        const allCharactersInThatSection: { characterId: string, displayName: string }[] = sections
            .filter(x => x.id == sectionId)
            .flatMap(x => x.lines)
            .flatMap(x => { return { characterId: x.characterId as string, displayName: x.character.displayName as string } })
            .filter((value, index, self) => onlyUniqueCharacterIds(value, index, self))
        const isSectionFullOfWatchers = allCharactersInThatSection.every(x => isCharacterOnline(x.characterId))

        if (isSectionFullOfWatchers == null || !isSectionFullOfWatchers)
            return

        const title = allCharactersInThatSection.map(x => x.displayName).join(", ")

        return (
            <div className={styles.presenceIndicatorContainer} title={title}>
                <div className={styles.presenceIndicator}>&nbsp;</div>
            </div>
        )
    }

    return (
        <div>
            {sections.map((section, index) => {
                return (
                    <div key={section.id}>
                        <h2 className={styles.sectionName}>
                            {section.displayName}
                            {displayPresenceIndicatorSection(section.id)}
                        </h2>
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