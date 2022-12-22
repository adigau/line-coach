import { ComponentProps, forwardRef, ReactNode, useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Document.module.css";
import { AnnotationType, CharacterSelectionType, OptionsSelectionType, SectionSelectionType } from "../../types/storage";
import { users } from "../../data/users";
import { useMutation, useRoom, useSelf, useStorage } from "../../liveblocks.config";
import { shallow } from "@liveblocks/client";
import { User } from "../../types";
import { CharacterStorage, LineStorage, ScriptType, SectionStorage, Section, Character } from "../../types/script";
// import { scripts } from "../../data/scripts";
import { Spinner } from "../../primitives/Spinner";
import { Sidebar } from "../../components/Sidebar";
import { Script } from "../../components/Script";

interface Props extends ComponentProps<"div"> {
  header: ReactNode;
}

export const DocumentLayout = forwardRef<HTMLElement, Props>(
  ({ header, className, ...props }) => {

    //////// Liveblocks - Presence
    const self = useSelf()
    const room = useRoom();

    //////// Liveblocks - Storage
    const characterSelections = useStorage((root) => root.characterSelections.get(self.id));
    const sectionSelections = useStorage((root) => root.sectionSelections.get(self.id));
    const optionsSelections = useStorage((root) => root.optionsSelections.get(self.id));
    const characters = useStorage((root) => root.characters);
    const sections = useStorage((root) => root.sections);
    const lines = useStorage((root) => root.lines);
    const annotations = useStorage(
      root => Array.from(root.annotations.values()),
      shallow,
    );

    //////// Liveblocks - Mutation
    const addOrUpdateOptionsSelection = useMutation(({ storage }, options: OptionsSelectionType) => {
      storage.get("optionsSelections").set(options.userId, options)
    }, []);
    const addOrUpdateAnnotation = useMutation(({ storage }, annotation: AnnotationType) => {
      storage.get("annotations").set(annotation.key, annotation)
    }, []);
    const addOrUpdateCharacterSelection = useMutation(({ storage }, characterSelection: CharacterSelectionType) => {
      storage.get("characterSelections").set(characterSelection.userId, characterSelection)
    }, []);
    const addOrUpdateSectionSelection = useMutation(({ storage }, sectionSelection: SectionSelectionType) => {
      storage.get("sectionSelections").set(sectionSelection.userId, sectionSelection)
    }, []);
    const addOrUpdateCharacter = useMutation(({ storage }, character: CharacterStorage) => {
      const index = storage.get("characters").findIndex(x => x.id == character.id);
      if (index < 0)
        storage.get("characters").push(character)
      else
        storage.get("characters").set(index, character)
    }, []);
    const addOrUpdateSection = useMutation(({ storage }, section: SectionStorage) => {
      const index = storage.get("sections").findIndex(x => x.id == section.id);
      if (index < 0)
        storage.get("sections").push(section)
      else
        storage.get("sections").set(index, section)
    }, []);
    const addOrUpdateLine = useMutation(({ storage }, line: LineStorage) => {
      const index = storage.get("lines").findIndex(x => x.id == line.id);
      if (index < 0)
        storage.get("lines").push(line)
      else
        storage.get("lines").set(index, line)
    }, []);

    //////// States
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [allUsers, setAllUsers] = useState<Omit<User, "color">[]>([])
    const [currentUser, setCurrentUser] = useState<Omit<User, "color">>({} as Omit<User, "color">)
    const [script, setScript] = useState<ScriptType>(null as any)
    const [cast, setCast] = useState<Character[]>([])
    const [isHiddenLines, setIsHiddenLines] = useState(optionsSelections != null ? optionsSelections.isHiddenLines : false)
    const [isAnnotationMode, setIsAnnotationMode] = useState(optionsSelections != null ? optionsSelections.isAnnotationMode : false)
    const [isAnnotationModeOnlyMine, setIsAnnotationModeOnlyMine] = useState(optionsSelections != null ? optionsSelections.isAnnotationModeOnlyMine : false)
    const [isDisplayPresenceMode, setIsDisplayPresenceMode] = useState(optionsSelections != null ? optionsSelections.isDisplayPresenceMode : true)
    const [searchTerm, setSearchTerm] = useState<string>("")

    //////// Events
    const onSearchTermChanged = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchTerm(e.target.value) }
    const isHiddenLinesChanged = (data: boolean) => setIsHiddenLines(data)
    const isAnnotationModeChanged = (data: boolean) => setIsAnnotationMode(data)
    const isAnnotationModeOnlyMineChanged = (data: boolean) => setIsAnnotationModeOnlyMine(data)
    const isDisplayPresenceModeChanged = (data: boolean) => setIsDisplayPresenceMode(data)
    const handleMenuClick = useCallback(() => { setMenuOpen((isOpen) => !isOpen); }, []);
    const scriptChanged = (data: ScriptType) => {
      setScript(data)
      const userToSections: SectionSelectionType =
      {
        userId: currentUser.id,
        hiddenSectionIds: data.sections.filter(c => !c.isDisplayed).map(c => c.id)
      }
      addOrUpdateSectionSelection(userToSections)
    }
    const castChanged = (data: Character[]) => {
      setCast(data)

      const userToCharacters: CharacterSelectionType =
      {
        userId: currentUser.id,
        characterIds: data.filter(c => c.isHighlighted).map(c => c.id)
      }
      addOrUpdateCharacterSelection(userToCharacters)
    }

    //////// useCallBack
    const loadScript = useCallback(
      () => {


        const yaya = sections.map(x => (
          {
            lines: lines.filter(y => y.sectionId == x.id),
            isDisplayed: true,
            ...x
          } as Section))

        const currentScript: ScriptType =
          {
            id: room.id,
            cast: characters,
            sections: yaya,

          } as ScriptType

        currentScript.cast.map(c => c.isHighlighted = getIsCharacterHighlightedFromStorage(characterSelections, c.id))
        currentScript.sections.map(s => s.isDisplayed = getIsSectionDisplayedFromStorage(sectionSelections, s.id))
        currentScript.sections.map(s => s.lines.map(l => l.character = {
          id: l.characterId,
          displayName: getCharacterDisplayNameFromUserId(cast, l.characterId),
          isHighlighted: false //DANGER HERE
        }))

        currentScript.sections.map(x => x.lines).flat().map(x => x.href = "#" + x.characterId + "_" + x.id)

        setScript(currentScript)
        setCast(currentScript.cast)
      }, [cast, characterSelections, sectionSelections])

    const loadUser = useCallback(
      (userId: string) => {
        const userIndex = users.findIndex((x, i) => x.id == userId)
        const newUser = users[userIndex]

        setCurrentUser({ ...newUser })
      }, [])

    useEffect(() => {
      const optionsSelection: OptionsSelectionType = {
        userId: self.id,
        isHiddenLines: isHiddenLines,
        isAnnotationMode: isAnnotationMode,
        isAnnotationModeOnlyMine: isAnnotationModeOnlyMine,
        isDisplayPresenceMode: isDisplayPresenceMode,
      }
      addOrUpdateOptionsSelection(optionsSelection)

      setAllUsers(users)
      loadUser(self.id)
      loadScript()
    }, [addOrUpdateOptionsSelection, self.id, isAnnotationMode, isDisplayPresenceMode, isHiddenLines, loadScript, loadUser, isAnnotationModeOnlyMine, room.id])

    if (script == null || cast == null) {
      return (<Spinner />)
    }

    return (
      <div className={clsx(className, styles.container)} {...props}>
        <header className={styles.header}>{header}</header>
        <aside className={styles.aside} data-open={isMenuOpen || undefined}>
          <Sidebar
            script={script}
            scriptChanged={scriptChanged}
            cast={cast}
            castChanged={castChanged}
            searchTerm={searchTerm}
            searchTermChanged={onSearchTermChanged}
            isHiddenLines={isHiddenLines}
            isHiddenLinesChanged={isHiddenLinesChanged}
            isAnnotationMode={isAnnotationMode}
            isAnnotationModeChanged={isAnnotationModeChanged}
            isDisplayPresenceMode={isDisplayPresenceMode}
            isDisplayPresenceModeChanged={isDisplayPresenceModeChanged}
            isAnnotationModeOnlyMine={isAnnotationModeOnlyMine}
            isAnnotationModeOnlyMineChanged={isAnnotationModeOnlyMineChanged}
            characterSelections={characterSelections}
            sectionSelections={sectionSelections}
            optionsSelections={optionsSelections} />
        </aside>
        <main className={styles.main}>
          <Script
            script={script}
            cast={cast}
            searchTerm={searchTerm}
            annotations={annotations}
            addOrUpdateAnnotation={addOrUpdateAnnotation}
            users={allUsers}
            currentUserId={self.id}
            isHiddenLines={isHiddenLines}
            isAnnotationMode={isAnnotationMode}
            isAnnotationModeOnlyMine={isAnnotationModeOnlyMine}
            isDisplayPresenceMode={isDisplayPresenceMode}
          />
        </main>
      </div>
    );
  }
);

function getCharacterDisplayNameFromUserId(
  cast: Character[],
  userId: string
) {
  const character = cast.find((x) => x.id === userId)
  const displayName = character == null ? "Unknown" : character.displayName
  return displayName
}

function getIsCharacterHighlightedFromStorage(
  characterSelections: CharacterSelectionType | undefined,
  characterId: string
): boolean {
  return (
    characterSelections != null &&
    characterSelections.characterIds.some((x) => x == characterId)
  )
}

function getIsSectionDisplayedFromStorage(
  sectionSelections: SectionSelectionType | undefined,
  sectionId: string
): boolean {
  return !(
    sectionSelections != null &&
    sectionSelections.hiddenSectionIds.some((x) => x == sectionId)
  )
}
