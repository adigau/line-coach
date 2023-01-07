import React, { useEffect, useMemo, useState } from "react";
import {
    Character,
    ScriptType,
    Section,
} from "../../types/script";
import { User } from "../../types";
import { Section as SectionComponent } from "../Section";
import styles from "./ScriptNavigator.module.css";
import { LinkIcon } from "../../icons";
import { useOthers, useRoom, useSelf, useStorage } from "../../liveblocks.config";
import { CharacterSelectionStorage } from "../../types/storage";
import { shallow } from "@liveblocks/client";
import { Button, LinkButton } from "../../primitives/Button";
import { Select } from "../../primitives/Select";
import Router, { useRouter } from "next/router";
import { SCENE_URL } from "../../constants";

type ScriptNavigatorProps = {
    sections: Section[];
    scene?: string;
    characters: Character[];
    searchTerm: string;
    isHiddenLines: boolean;
    isAnnotationMode: boolean;
    isAnnotationModeOnlyMine: boolean;
};

export function ScriptNavigator({
    sections,
    searchTerm,
    characters,
    scene,
    isHiddenLines,
    isAnnotationMode,
    isAnnotationModeOnlyMine }: ScriptNavigatorProps) {

    const self = useSelf()
    const room = useRoom()
    const others = useOthers()
    const users = useMemo(
        () => (self ? [self, ...others] : others),
        [self, others]
    );
    const router = useRouter()

    const [sceneId, setSceneId] = useState<string>(scene ?? sections[0].id)

    const [activeSection, setActiveSection] = useState<Section>()
    const [previousSection, setPreviousSection] = useState<Section>()
    const [nextSection, setNextSection] = useState<Section>()

    useEffect(() => {
        if (sections == null || sections.length <= 0 || sceneId == null) {
            setActiveSection(undefined)
            setPreviousSection(undefined)
            setNextSection(undefined)
        }
        const activeIndex = sections.findIndex(x => x.id == sceneId)

        setActiveSection(sections[activeIndex])
        setPreviousSection(sections[activeIndex - 1])
        setNextSection(sections[activeIndex + 1])

    }, [sceneId])

    const othersCharacterSelections: CharacterSelectionStorage[] = useStorage(
        root => Array.from(root.characterSelections.values()).filter((x) => users.some(y => y.id == x.userId)),
        shallow,
    );

    const [charactersToWatchers, setCharactersToWatchers] = useState<Map<string, (User | null)[]>>()

    useEffect(() => {
        const fetchData = () => {
            const tempWatchers = new Map<string, (User | null)[]>()
            characters.map(x => {
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
    }, [characters, othersCharacterSelections, others, users])

    const renderActiveSection = () => {
        return (<SectionComponent
            section={activeSection}
            cast={characters}
            isHiddenLines={isHiddenLines}
            isAnnotationMode={isAnnotationMode}
            isAnnotationModeOnlyMine={isAnnotationModeOnlyMine} />
        );
    };

    const displayPresenceIndicatorSection = () => {
        if (charactersToWatchers == null || activeSection == null)
            return

        const allCharactersInThatSection: { characterId: string, displayName: string }[] = activeSection?.lines
            .flatMap(x => { return { characterId: x.characterId as string, displayName: x.character.displayName as string } })
            .filter((value, index, self) => onlyUniqueCharacterIds(value, index, self));

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

    function onlyUniqueCharacterIds(value: { characterId: string, displayName: string }, index: number, self: { characterId: string, displayName: string }[]) {
        return self.indexOf(value) === index;
    }

    function isCharacterOnline(characterId: string): boolean {
        if (charactersToWatchers == null)
            return false
        const onlineUsers = charactersToWatchers.get(characterId);
        return onlineUsers != null && onlineUsers.length > 0
    }

    function changeScene(value: string) {
        setSceneId(value);
        router.push(getSceneUrl(value))
    }

    function getSceneUrl(value: string) {
        const url = SCENE_URL("script", room.id, value)
        return url;
    }

    function goToPreviousSection(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        if (previousSection == null)
            return;
        changeScene(previousSection.id)
    }
    function goToNextSection(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        if (nextSection == null)
            return;
        changeScene(nextSection.id)
    }

    return <>
        <div className={styles.sectionHeaderContainer}>
            <Button aria-disabled={previousSection == null} onClick={(event) => goToPreviousSection(event)} variant="secondary">Previous</Button>
            <h2 className={styles.sectionName}>
                <Select
                    aboveOverlay
                    name="sectionId"
                    className={styles.sectionSelect}
                    items={sections.map((section) => ({
                        value: section.id,
                        title: section.displayName,
                    }))}
                    initialValue={sceneId}
                    value={sceneId}
                    placeholder="Choose a section…"
                    onChange={(value) => { changeScene(value) }}
                    required
                />
                {displayPresenceIndicatorSection()}
            </h2>
            <Button aria-disabled={nextSection == null} onClick={(event) => goToNextSection(event)} variant="secondary">Next</Button>
        </div>
        {renderActiveSection()}
    </>
}

