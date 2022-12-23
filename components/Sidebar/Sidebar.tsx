import React, { useEffect, useMemo, useState } from 'react'
import { Character, ScriptType, Section } from "../../types/script"
import { CharacterSelectionStorage } from "../../types/storage"
import styles from "./Sidebar.module.css"
import { User } from '../../types';
import { useOthers, useSelf, useStorage } from '../../liveblocks.config';
import { shallow } from '@liveblocks/react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Input } from '../../primitives/Input';
import clsx from 'clsx';
import { DataWidget } from '../DataWidget';
import { Checkbox } from '../../primitives/Checkbox';

type SidebarProps = {

    script: ScriptType,
    scriptChanged: (data: ScriptType) => void,
    cast: Character[],
    castChanged: (data: Character[]) => void,

    searchTerm: string,
    searchTermChanged: (event: React.ChangeEvent<HTMLInputElement>) => void,
    isHiddenLines: boolean,
    isHiddenLinesChanged: (data: boolean) => void,
    isAnnotationMode: boolean,
    isAnnotationModeChanged: (isChecked: boolean) => void,
    isAnnotationModeOnlyMine: boolean,
    isAnnotationModeOnlyMineChanged: (data: boolean) => void
}

export function Sidebar({ script, scriptChanged, cast, castChanged, searchTerm, searchTermChanged, isHiddenLines, isHiddenLinesChanged, isAnnotationMode, isAnnotationModeChanged, isAnnotationModeOnlyMine, isAnnotationModeOnlyMineChanged }: SidebarProps) {

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

    const onIsHiddenLinesChanged = (checked: boolean) => isHiddenLinesChanged(checked)
    const onIsAnnotationModeChanged = (checked: boolean) => isAnnotationModeChanged(checked)
    const onIsAnnotationModeOnlyMineChanged = (checked: boolean) => isAnnotationModeOnlyMineChanged(checked)

    const onHighlightCharacterClick = (checked: boolean, value?: string) => {
        const newCast = cast.slice()
        const castKey = newCast.findIndex((x) => x.id == value)
        newCast[castKey].isHighlighted = checked
        castChanged(newCast)
    }
    const onHighlightSectionClick = (checked: boolean, value?: string) => {
        const newSections: Section[] = script.sections.slice()
        const sectionKey = newSections.findIndex((x) => x.id == value)
        newSections[sectionKey].isDisplayed = checked
        const newScript = { ...script }
        newScript.sections = newSections
        scriptChanged(newScript)
    }

    function isCharacterOnline(characterId: string): boolean {
        if (charactersToWatchers == null)
            return false
        const onlineUsers = charactersToWatchers.get(characterId);
        return onlineUsers != null && onlineUsers.length > 0
    }

    function onlyUniqueCharacterIds(value: { characterId: string, displayName: string }, index: number, self: { characterId: string, displayName: string }[]) {
        return self.indexOf(value) === index;
    }

    const displayPresenceIndicatorCharacter = (characterId: string) => {
        if (charactersToWatchers == null)
            return

        const watchersOfThisCharacter = charactersToWatchers.get(characterId)?.filter(x => x?.id != self.id)

        if (watchersOfThisCharacter == null || watchersOfThisCharacter.length <= 0)
            return

        const title = watchersOfThisCharacter.map(x => x?.name).join(", ")

        return (
            <div className={styles.presenceIndicatorContainer} title={title}>
                <div className={styles.presenceIndicator}>&nbsp;</div>
            </div>
        )
    }

    const displayPresenceIndicatorSection = (sectionId: string) => {
        if (charactersToWatchers == null)
            return

        const allCharactersInThatSection: { characterId: string, displayName: string }[] = script.sections
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

    const renderSections = (section: Section) => {
        return (
            <li key={section.id}>
                <Checkbox checked={section.isDisplayed} id={section.id} name={section.id} value={section.id}
                    onValueChange={onHighlightSectionClick} initialValue={section.isDisplayed} label={section.displayName} />
                {displayPresenceIndicatorSection(section.id)}
            </li>
        )
    }

    const renderCharacters = (character: Character) => {
        return (
            <li key={"character_" + character.id}>
                <Checkbox initialValue={character.isHighlighted} checked={character.isHighlighted} onValueChange={onHighlightCharacterClick} id={character.id} name={character.id} value={character.id} label={character.displayName} />
                {displayPresenceIndicatorCharacter(character.id)}
            </li>
        )
    }

    return (
        <div className={styles.containerOptions}>
            <div className={styles.searchContainer}>
                <Input placeholder='Search through your text' className={styles.searchInput} type='text' value={searchTerm} onChange={searchTermChanged} />
            </div>
            <Accordion.Root className={styles.AccordionRoot} type="single" defaultValue="item-1" collapsible>
                <Accordion.Item className={styles.AccordionItem} value="item-1">
                    <Accordion.Header className={styles.AccordionHeader}>
                        <Accordion.Trigger className={styles.AccordionTrigger}>
                            <div className={styles.AccordionTriggerText}>Select characters</div>
                            <div className={styles.AccordionTriggerInfo}>
                                <div className={styles.AccordionTriggerInfoCount}>
                                    ({cast.filter(x => x.isHighlighted).length}/{cast.length})
                                </div>
                                <ChevronDownIcon className={styles.AccordionChevron} aria-hidden />
                            </div>
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className={clsx(styles.AccordionContent, styles.AccordionContentText)}>
                        <ul className={styles.characters}>
                            {cast.map(character => renderCharacters(character))}
                        </ul>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item className={styles.AccordionItem} value="item-2">
                    <Accordion.Header className={styles.AccordionHeader}>
                        <Accordion.Trigger className={styles.AccordionTrigger}>
                            <div className={styles.AccordionTriggerText}>Select sections</div>
                            <div className={styles.AccordionTriggerInfo}>
                                <div className={styles.AccordionTriggerInfoCount}>
                                    ({script.sections.filter(x => x.isDisplayed).length}/{script.sections.length})
                                </div>
                                <ChevronDownIcon className={styles.AccordionChevron} aria-hidden />
                            </div>
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className={clsx(styles.AccordionContent, styles.AccordionContentText)}>
                        <ul>
                            {script.sections.map(section => renderSections(section))}
                        </ul>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item className={styles.AccordionItem} value="item-3">
                    <Accordion.Header className={styles.AccordionHeader}>
                        <Accordion.Trigger className={styles.AccordionTrigger}>
                            <div className={styles.AccordionTriggerText}>Options</div>
                            <div className={styles.AccordionTriggerInfo}>
                                <div className={styles.AccordionTriggerInfoCount}>
                                    ({[isHiddenLines, isAnnotationMode].filter(x => x).length}/{[isHiddenLines, isAnnotationMode].length})
                                </div>
                                <ChevronDownIcon className={styles.AccordionChevron} aria-hidden />
                            </div>
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className={clsx(styles.AccordionContent, styles.AccordionContentText)}>
                        <ul>
                            {renderHideLines()}
                            {renderAnnotationMode()}
                        </ul>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item className={styles.AccordionItem} value="item-4">
                    <Accordion.Header className={styles.AccordionHeader}>
                        <Accordion.Trigger className={styles.AccordionTrigger}>
                            <div className={styles.AccordionTriggerText}>Data</div>
                            <div className={styles.AccordionTriggerInfo}>
                                <ChevronDownIcon className={styles.AccordionChevron} aria-hidden />
                            </div>
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className={clsx(styles.AccordionContent, styles.AccordionContentText)}>
                        <DataWidget
                            script={script}
                            cast={cast}
                        />
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        </div>
    )

    function renderHideLines() {
        return <li>
            <Checkbox checked={isHiddenLines} id="isHiddenLines" name="isHiddenLines" value="isHiddenLines"
                onValueChange={onIsHiddenLinesChanged} initialValue={isHiddenLines} label="🧑‍🦯 Hide your lines" />
        </li>;
    }

    function renderAnnotationMode() {
        return <li>
            <Checkbox checked={isAnnotationMode} id="isAnnotationMode" name="isAnnotationMode" value="isAnnotationMode"
                onValueChange={onIsAnnotationModeChanged} initialValue={isAnnotationMode} label="📝 Activate annotation mode" />
            {renderAnnotationModeOnlyMine()}
        </li>;
    }

    function renderAnnotationModeOnlyMine() {
        return isAnnotationMode && (<ul><li>
            <Checkbox checked={isAnnotationModeOnlyMine} id="isAnnotationModeOnlyMine" name="isAnnotationModeOnlyMine" value="isAnnotationModeOnlyMine"
                onValueChange={onIsAnnotationModeOnlyMineChanged} initialValue={isAnnotationModeOnlyMine} label="☝️ Only show mine" />
        </li></ul>);
    }
}