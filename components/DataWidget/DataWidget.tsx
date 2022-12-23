
import React from 'react'
import { ScriptType, Character } from "../../types/script"
import styles from "./DataWidget.module.css";

type DataWidgetProps = {
    script: ScriptType,
    cast: Character[]
}

type FlattenedLine = {
    section: string,
    id: string,
    characterId: string,
    text: string
}

type FlattenedCharacter = {
    id: string,
    displayName: string,
    numberOfLines: number,
    numberOfWords: number
}

type DataSummary = {
    numberOfSections: number,
    numberOfCharacters: number,
    numberOfLines: number,
    numberOfWords: number,
    characters: FlattenedCharacter[]
}

function getNumberOfLinesPerCharacter(characterId: string, flattenedListOfLines: FlattenedLine[]) {
    return flattenedListOfLines.filter(l => l.characterId == characterId).length
}
function getNumberOfWordsPerCharacter(characterId: string, flattenedListOfLines: FlattenedLine[]) {
    return flattenedListOfLines.filter(l => l.characterId == characterId).map(l => l.text.split(' ').length).reduce((prev, curr) => prev + curr, 0)
}

function renderDataCharacter(character: FlattenedCharacter) {
    const text = character.displayName + ": " + character.numberOfLines + " lines, " + character.numberOfWords + " words"
    return (
        <li title={text} key={character.id}>{text}</li>
    )
}

export function DataWidget(props: DataWidgetProps) {
    const { script, cast } = props;

    const sections = script.sections.filter(s => s.isDisplayed)
    const flattenedListOfLines: FlattenedLine[] = []
    const flattenedListOfCharacters: FlattenedCharacter[] = []

    sections.forEach(section =>
        section.lines.forEach(line => flattenedListOfLines.push({
            section: section.id,
            id: line.id,
            characterId: line.characterId,
            text: line.text
        })))

    cast.forEach(character => {
        const numberOfLines = getNumberOfLinesPerCharacter(character.id, flattenedListOfLines)
        if (numberOfLines > 0) {
            flattenedListOfCharacters.push(
                {
                    id: character.id,
                    displayName: character.displayName,
                    numberOfLines: getNumberOfLinesPerCharacter(character.id, flattenedListOfLines),
                    numberOfWords: getNumberOfWordsPerCharacter(character.id, flattenedListOfLines)
                }
            )
        }
    })

    const dataSummary: DataSummary =
    {
        numberOfSections: sections.length,
        numberOfCharacters: flattenedListOfCharacters.length,
        numberOfLines: flattenedListOfCharacters.map(c => c.numberOfLines).reduce((prev, curr) => prev + curr, 0),
        numberOfWords: flattenedListOfCharacters.map(c => c.numberOfWords).reduce((prev, curr) => prev + curr, 0),
        characters: flattenedListOfCharacters
    }

    return (
        <div>
            <ul className={styles.dataUl}>
                <li>{dataSummary.numberOfSections} sections</li>
                <li>{dataSummary.numberOfLines} lines</li>
                <li>{dataSummary.numberOfWords} words</li>
                <li>
                    {dataSummary.numberOfCharacters} characters

                    <ul className={styles.dataUl}>
                        {dataSummary.characters.sort(compareForSortingByNumWords).map(character => renderDataCharacter(character))}
                    </ul>
                </li>
            </ul>
        </div>
    )
}

function compareForSortingByNumWords(a: FlattenedCharacter, b: FlattenedCharacter) {
    if (a.numberOfWords < b.numberOfWords) {
        return 1;
    }
    if (a.numberOfWords > b.numberOfWords) {
        return -1;
    }
    return 0;
}
