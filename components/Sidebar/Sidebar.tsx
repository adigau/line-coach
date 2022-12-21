import React, { useEffect, useState } from 'react'
import { ScriptType, CharacterType, SectionType } from "../../types/script"
import { CharacterSelectionType, SectionSelectionType, OptionsSelectionType } from "../../types/storage"
import styles from "./Sidebar.module.css"
import { User } from '../../types';
import { useOthers, useSelf, useStorage } from '../../liveblocks.config';
import { shallow } from '@liveblocks/react';
import { DocumentCharacterAvatars } from '../Document/DocumentCharacterAvatars';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Input } from '../../primitives/Input';
import clsx from 'clsx';
import { DataWidget } from '../DataWidget';

type SidebarProps = {

    script: ScriptType,
    scriptChanged: Function,
    cast: CharacterType[],
    castChanged: Function,

    searchTerm: string,
    searchTermChanged: (event: React.ChangeEvent<HTMLInputElement>) => void,
    isHiddenLines: boolean,
    isHiddenLinesChanged: Function,
    isAnnotationMode: boolean,
    isAnnotationModeChanged: (isChecked: boolean) => void,
    isAnnotationModeOnlyMine: boolean,
    isAnnotationModeOnlyMineChanged: Function,
    isDisplayPresenceMode: boolean,
    isDisplayPresenceModeChanged: Function,

    characterSelections: CharacterSelectionType | undefined,
    sectionSelections: SectionSelectionType | undefined,
    optionsSelections: OptionsSelectionType | undefined
}

export function Sidebar({ script, scriptChanged, cast, castChanged, searchTerm, searchTermChanged, isHiddenLines, isHiddenLinesChanged, isAnnotationMode, isAnnotationModeChanged, isDisplayPresenceMode, isDisplayPresenceModeChanged, characterSelections, sectionSelections, optionsSelections, isAnnotationModeOnlyMine, isAnnotationModeOnlyMineChanged, ...props }: SidebarProps) {

    const self = useSelf()
    const others = useOthers()

    const othersCharacterSelections: CharacterSelectionType[] = useStorage(
        root => Array.from(root.characterSelections.values()).filter((x) => x.userId != self.id && others.some(y => y.id == x.userId)),
        shallow,
    );

    const [charactersToWatchers, setCharactersToWatchers] = useState<Map<string, (User | null)[]>>()

    useEffect(() => {
        // declare the async data fetching function
        const fetchData = () => {
            const tempWatchers = new Map<string, (User | null)[]>()
            cast.map(x => {
                const id = x.id
                //A reminder of a way to make async calls in a map work 👇
                //const watchers = await Promise.all(othersCharacterSelections.filter(y => y.characterIds.some(z => z == x.id)).map(x=>getUser(x.userId)))
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

    const onIsHiddenLinesChanged = (event: React.ChangeEvent<HTMLInputElement>) => isHiddenLinesChanged(event.target.checked)
    const onIsAnnotationModeChanged = (event: React.ChangeEvent<HTMLInputElement>) => isAnnotationModeChanged(event.target.checked)
    const onIsAnnotationModeOnlyMineChanged = (event: React.ChangeEvent<HTMLInputElement>) => isAnnotationModeOnlyMineChanged(event.target.checked)

    const onHighlightCharacterClick = (event: React.ChangeEvent<HTMLInputElement>, characterId: string) => {
        const newCast = cast.slice()
        const castKey = newCast.findIndex((x) => x.id == characterId)
        newCast[castKey].isHighlighted = event.target.checked
        castChanged(newCast)
    }
    const onHighlightSectionClick = (event: React.ChangeEvent<HTMLInputElement>, sectionId: string) => {
        const newSections: SectionType[] = script.sections.slice()
        const sectionKey = newSections.findIndex((x) => x.id == sectionId)
        newSections[sectionKey].isDisplayed = event.target.checked
        const newScript = { ...script }
        newScript.sections = newSections
        scriptChanged(newScript)
    }

    const renderSections = (section: SectionType) => {
        return (
            <li key={section.id}>
                <input
                    type="checkbox" checked={section.isDisplayed} id={section.id} name={section.id} value={section.id}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => onHighlightSectionClick(event, section.id)} />
                <label title={section.displayName} htmlFor={section.id}>
                    {section.displayName}
                </label>
            </li>
        )
    }

    const displayAvatarStack = (characterId: string) => {
        if (!isDisplayPresenceMode)
            return

        if (charactersToWatchers == null)
            return

        const character = charactersToWatchers.get(characterId)

        if (character == null)
            return

        return (
            <div className={styles.avatarStack}>
                <DocumentCharacterAvatars avatars={character} />
            </div>)
    }

    const renderCharacters = (character: CharacterType) => {
        return (
            <li key={"character_" + character.id}>
                <input
                    type="checkbox" checked={character.isHighlighted} id={character.id} name={character.id} value={character.id}
                    onChange={(event) => onHighlightCharacterClick(event, character.id)} />
                <label htmlFor={character.id}>
                    {character.displayName}
                </label>
                {displayAvatarStack(character.id)}
            </li>
        )
    }

    return (
        <div className={styles.containerOptions}>
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
                            <div className={styles.AccordionTriggerText}>Search</div>
                            <div className={styles.AccordionTriggerInfo}>
                                <ChevronDownIcon className={styles.AccordionChevron} aria-hidden />
                            </div>
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className={clsx(styles.AccordionContent, styles.AccordionContentText)}>
                        <Input placeholder='Search through your text' className={styles.searchInput} type='text' value={searchTerm} onChange={searchTermChanged} />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item className={styles.AccordionItem} value="item-5">
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
            <input
                type="checkbox" checked={isHiddenLines} id="isHiddenLines" name="isHiddenLines" value="isHiddenLines"
                onChange={(event) => onIsHiddenLinesChanged(event)} />
            <label htmlFor="isHiddenLines">
                🧑‍🦯 Hide your lines
            </label>
        </li>;
    }

    function renderAnnotationMode() {
        return <li>
            <input
                type="checkbox" checked={isAnnotationMode} id="isAnnotationMode" name="isAnnotationMode" value="isAnnotationMode"
                onChange={(event) => onIsAnnotationModeChanged(event)} />
            <label htmlFor="isAnnotationMode">
                📝 Activate annotation mode
            </label>
            {renderAnnotationModeOnlyMine()}
        </li>;
    }
    function renderAnnotationModeOnlyMine() {
        return isAnnotationMode && (<ul><li>
            <input
                type="checkbox" checked={isAnnotationModeOnlyMine} id="isAnnotationModeOnlyMine" name="isAnnotationModeOnlyMine" value="isAnnotationModeOnlyMine"
                onChange={(event) => onIsAnnotationModeOnlyMineChanged(event)} />
            <label htmlFor="isAnnotationModeOnlyMine">
                ☝️ Only show mine
            </label>
        </li></ul>);
    }
}