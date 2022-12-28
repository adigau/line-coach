import React, { useEffect, useMemo, useState } from "react";
import { Line as LineComponent } from "../Line";
import styles from "./Section.module.css";
import {
    Character,
    Section,
    Line,
} from "../../types/script";
import { CharacterSelectionStorage } from "../../types/storage";
import * as RadixSeparator from "@radix-ui/react-separator";
import { useOthers, useSelf, useStorage } from "../../liveblocks.config";
import { shallow } from "@liveblocks/client";
import { User } from "../../types";
import { LinkIcon } from "../../icons";

type SectionProps = {
    sections: Section[]
    cast: Character[];
    isHiddenLines: boolean;
    isAnnotationMode: boolean;
    isAnnotationModeOnlyMine: boolean;
};

export function Section({
    sections,
    cast,
    isHiddenLines,
    isAnnotationMode,
    isAnnotationModeOnlyMine
}: SectionProps) {
    const self = useSelf()
    const others = useOthers()
    const users = useMemo(
        () => (self ? [self, ...others] : others),
        [self, others]
    );

    const othersCharacterSelections: CharacterSelectionStorage[] = useStorage(
        root => Array.from(root.characterSelections.values()).filter((x) => users.some(y => y.id == x.userId)),
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
                        const user = users.filter(y => y.id == x.userId)[0]
                        return { id: user.id, name: user.info.name, avatar: user.info.avatar } as User
                    })
                tempWatchers.set(id, watchers)
            })

            setCharactersToWatchers(tempWatchers)
        }
        fetchData();
    }, [cast, othersCharacterSelections, others, users])

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
                    <div className={styles.section} id={section.href} key={section.id}>
                        <h2 className={styles.sectionName}>
                            <a className={styles.sectionLink} href={"#" + section.href}>
                                <span className={styles.sectionLinkIconContainer}>
                                    <span className={styles.sectionLinkIcon}>
                                        <LinkIcon />
                                    </span>
                                </span>
                                {section.displayName}
                                {displayPresenceIndicatorSection(section.id)}
                            </a>
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