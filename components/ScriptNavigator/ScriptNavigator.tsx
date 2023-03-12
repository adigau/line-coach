import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Character,
    Section,
} from "../../types/script";
import { DocumentLanguage, User } from "../../types";
import { Section as SectionComponent } from "../Section";
import styles from "./ScriptNavigator.module.css";
import { useOthers, useRoom, useSelf, useStorage } from "../../liveblocks.config";
import { CharacterSelectionStorage } from "../../types/storage";
import { shallow } from "@liveblocks/client";
import { Button } from "../../primitives/Button";
import { Select } from "../../primitives/Select";
import { useRouter } from "next/router";
import { SCENE_URL } from "../../constants";

type ScriptNavigatorProps = {
    sections: Section[];
    sectionIdUrl?: string;
    characters: Character[];
    searchTerm: string;
    isHiddenLines: boolean;
    isAnnotationMode: boolean;
    isAnnotationModeOnlyMine: boolean;
    lang: DocumentLanguage;
};

export function ScriptNavigator({
    sections,
    searchTerm,
    characters,
    sectionIdUrl,
    isHiddenLines,
    isAnnotationMode,
    isAnnotationModeOnlyMine,
    lang }: ScriptNavigatorProps) {

    const self = useSelf()
    const room = useRoom()
    const others = useOthers()
    const users = useMemo(
        () => (self ? [self, ...others] : others),
        [self, others]
    );
    const router = useRouter()

    const [sceneId, setSceneId] = useState<string>(initSceneId())

    function initSceneId(): string {
        if (sectionIdUrl == null || sections.find(x => x.id == sectionIdUrl) == null) {
            return sections[0].id
        }
        else
            return sectionIdUrl
    }

    const [activeSection, setActiveSection] = useState<Section>()
    const [previousSection, setPreviousSection] = useState<Section>()
    const [nextSection, setNextSection] = useState<Section>()

    useEffect(() => {
        if (sections == null || sections.length <= 0 || sceneId == null) {
            return;
        }
        const activeIndex = sections.findIndex(x => x.id == sceneId)

        setActiveSection(sections[activeIndex])
        setPreviousSection(sections[activeIndex - 1])
        setNextSection(sections[activeIndex + 1])

    }, [sceneId])

    useEffect(() => {
        window.addEventListener('keyup', (event) => {
            if (document.activeElement?.nodeName == "TEXTAREA")
                return;
            console.log(document.activeElement)
            if (event.key == "ArrowRight") {
                goToNextSection()
            }
            else if (event.key == "ArrowLeft") {
                goToPreviousSection()
            }
        })
    }, [nextSection, previousSection, activeSection, sceneId]);

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
        return activeSection != null ? (<SectionComponent
            section={activeSection}
            cast={characters}
            isHiddenLines={isHiddenLines}
            isAnnotationMode={isAnnotationMode}
            isAnnotationModeOnlyMine={isAnnotationModeOnlyMine}
            lang={lang} />
        ) : <></>;
    };

    function isAllPresencePerSection(sectionId: string): boolean {
        if (sections == null)
            return false;

        const section = sections.find(x => x.id == sectionId);

        if (section == null)
            return false;

        const allCharactersInThatSection: { characterId: string; displayName: string; }[] = section.lines
            .flatMap(x => { return { characterId: x.characterId as string, displayName: x.character.displayName as string }; })
            .filter((value, index, self) => onlyUniqueCharacterIds(value, index, self));

        const isSectionFullOfWatchers = allCharactersInThatSection.every(x => isCharacterOnline(x.characterId));

        if (isSectionFullOfWatchers == null || !isSectionFullOfWatchers)
            return false;

        else
            return true;
    }

    function isAssignedPerSection(sectionId: string): boolean {
        if (charactersToWatchers == null || sections == null)
            return false;

        const section = sections.find(x => x.id == sectionId);

        if (section == null)
            return false;

        const allCharactersAssignedInThatSection: { characterId: string; displayName: string; }[] = section.lines
            .flatMap(x => { return { characterId: x.characterId as string, displayName: x.character.displayName as string, isAssigned: x.character.isHighlighted }; })
            .filter(x => x.isAssigned)

        return allCharactersAssignedInThatSection.length > 0
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
        return SCENE_URL("script", room.id, value)
    }

    function goToPreviousSection(): void {
        if (previousSection == null)
            return;
        changeScene(previousSection.id)
    }
    function goToNextSection(): void {
        if (nextSection == null)
            return;
        changeScene(nextSection.id)
    }


    //Support for ScrollTo anchor
    //////// Next - Router
    const { asPath } = useRouter();
    const scrolledRef = useRef(false);
    const hash = asPath.split('#')[1];
    const hashRef = useRef(hash);
    useEffect(() => {
        if (hash) {
            // We want to reset if the hash has changed
            if (hashRef.current !== hash) {
                hashRef.current = hash;
                scrolledRef.current = false;
            }
            // only attempt to scroll if we haven't yet (this could have just reset above if hash changed)
            if (!scrolledRef.current) {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    scrolledRef.current = true;
                }
            }
        }
    }, [activeSection, hash]);

    return <div>
        <div className={styles.sectionHeaderContainer}>
            <Button disabled={previousSection == null} onClick={goToPreviousSection} variant="secondary">⏮️ Previous</Button>
            <h2 className={styles.sectionName}>
                <Select
                    aboveOverlay
                    name="sectionId"
                    className={styles.sectionSelect}
                    items={sections.map((section) => ({
                        value: section.id,
                        title: (isAssignedPerSection(section.id) ? "👉 " : "") + section.displayName + (isAllPresencePerSection(section.id) ? " 🟢" : ""),
                    }))}
                    initialValue={sceneId}
                    value={sceneId}
                    placeholder="Choose a section…"
                    onChange={(value) => { changeScene(value) }}
                    required
                />
            </h2>
            <Button disabled={nextSection == null} onClick={goToNextSection} variant="secondary">Next ⏭️</Button>
        </div>
        {renderActiveSection()}
    </div>
}

