import { ComponentProps, forwardRef, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Document.module.css";
import { CharacterSelectionStorage, OptionsSelectionStorage, SectionSelectionStorage } from "../../types/storage";
import { users } from "../../data/users";
import { useMutation, useRoom, useSelf, useStorage } from "../../liveblocks.config";
import { User } from "../../types";
import { ScriptType, Section, Character, Line } from "../../types/script";
import { Spinner } from "../../primitives/Spinner";
import { Sidebar } from "../../components/Sidebar";
import { useRouter } from "next/router";
import Head from 'next/head'
import { Document } from "../../types";
import { ScriptNavigator } from "../../components/ScriptNavigator";

interface Props extends ComponentProps<"div"> {
  header: ReactNode;
  isOpen: boolean;
  roomDocument?: Document;
}

export const DocumentLayout = forwardRef<HTMLElement, Props>(
  ({ header, isOpen, roomDocument, className, ...props }) => {

    //////// Next - Router
    const { asPath } = useRouter();

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

    //////// Liveblocks - Mutation
    const addOrUpdateOptionsSelection = useMutation(({ storage }, options: OptionsSelectionStorage) => {
      storage.get("optionsSelections").set(options.userId, options)
    }, []);
    const addOrUpdateCharacterSelection = useMutation(({ storage }, characterSelection: CharacterSelectionStorage) => {
      storage.get("characterSelections").set(characterSelection.userId, characterSelection)
    }, []);
    const addOrUpdateSectionSelection = useMutation(({ storage }, sectionSelection: SectionSelectionStorage) => {
      storage.get("sectionSelections").set(sectionSelection.userId, sectionSelection)
    }, []);

    //////// States
    const [allUsers, setAllUsers] = useState<Omit<User, "color">[]>([])
    const [currentUser, setCurrentUser] = useState<Omit<User, "color">>({} as Omit<User, "color">)
    const [script, setScript] = useState<ScriptType>(null as any)
    const [cast, setCast] = useState<Character[]>([])
    const [isHiddenLines, setIsHiddenLines] = useState(optionsSelections != null ? optionsSelections.isHiddenLines : false)
    const [isAnnotationMode, setIsAnnotationMode] = useState(optionsSelections != null ? optionsSelections.isAnnotationMode : false)
    const [isAnnotationModeOnlyMine, setIsAnnotationModeOnlyMine] = useState(optionsSelections != null ? optionsSelections.isAnnotationModeOnlyMine : true)
    const [searchTerm, setSearchTerm] = useState<string>("")

    //////// Events
    const onSearchTermChanged = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchTerm(e.target.value) }
    const isHiddenLinesChanged = (data: boolean) => setIsHiddenLines(data)
    const isAnnotationModeChanged = (data: boolean) => setIsAnnotationMode(data)
    const isAnnotationModeOnlyMineChanged = (data: boolean) => setIsAnnotationModeOnlyMine(data)
    const scriptChanged = (data: ScriptType) => {
      setScript(data)
      const userToSections: SectionSelectionStorage =
      {
        userId: currentUser.id,
        hiddenSectionIds: data.sections.map(c => c.id)
      }
      addOrUpdateSectionSelection(userToSections)
    }
    const castChanged = (data: Character[]) => {
      setCast(data)

      const userToCharacters: CharacterSelectionStorage =
      {
        userId: currentUser.id,
        characterIds: data.filter(c => c.isHighlighted).map(c => c.id)
      }
      addOrUpdateCharacterSelection(userToCharacters)
    }

    //////// useCallBack
    const loadScript = useCallback(
      () => {
        const castEnriched = characters.map(x => (
          {
            isHighlighted: getIsCharacterHighlightedFromStorage(characterSelections, x.id),
            ...x
          }))

        const sectionsEnriched = sections.map(x => (
          {
            href: "section" + x.id,
            lines: lines.filter(y => y.sectionId == x.id)
              .map(x => (
                {
                  href: "line" + x.id + "_" + x.characterId,
                  character: getCharacterById(x.characterId, cast),
                  ...x
                } as Line)),
            ...x
          } as Section))

        const script: ScriptType =
          {
            id: room.id,
            cast: castEnriched,
            sections: sectionsEnriched,
          } as ScriptType

        setScript(script)
        setCast(script.cast)
      }, [cast, characterSelections, characters, lines, room.id, sectionSelections, sections])

    const loadUser = useCallback(
      (userId: string) => {
        const userIndex = users.findIndex((x) => x.id == userId)
        const newUser = users[userIndex]

        setCurrentUser({ ...newUser })
      }, [])

    //////// useEffect
    useEffect(() => {
      const optionsSelection: OptionsSelectionStorage = {
        userId: self.id,
        isHiddenLines: isHiddenLines,
        isAnnotationMode: isAnnotationMode,
        isAnnotationModeOnlyMine: isAnnotationModeOnlyMine,
      }
      addOrUpdateOptionsSelection(optionsSelection)

      setAllUsers(users)
      loadUser(self.id)
      loadScript()
    }, [addOrUpdateOptionsSelection, self.id, isAnnotationMode, isHiddenLines, loadScript, loadUser, isAnnotationModeOnlyMine, room.id])

    //Support for ScrollTo anchor
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
    }, [script, cast, asPath, hash]);

    if (script == null || cast == null) {
      return (<Spinner />)
    }

    return (
      <>
        <Head>
          <title>{roomDocument != null ? roomDocument.name : "LineCoach"}</title>
        </Head>
        <div className={clsx(className, styles.container)} {...props}>
          <header className={styles.header}>{header}</header>
          <aside className={styles.aside} data-open={isOpen || undefined}>
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
              isAnnotationModeOnlyMine={isAnnotationModeOnlyMine}
              isAnnotationModeOnlyMineChanged={isAnnotationModeOnlyMineChanged}
            />
          </aside>
          <main className={styles.main}>
            <ScriptNavigator
              script={script}
              cast={cast}
              searchTerm={searchTerm}
              users={allUsers}
              isHiddenLines={isHiddenLines}
              isAnnotationMode={isAnnotationMode}
              isAnnotationModeOnlyMine={isAnnotationModeOnlyMine}
            />
          </main>
        </div>
      </>
    );
  }
);

function getIsCharacterHighlightedFromStorage(
  characterSelections: CharacterSelectionStorage | undefined,
  characterId: string
): boolean {
  return (
    characterSelections != null &&
    characterSelections.characterIds.some((x) => x == characterId)
  )
}

function getCharacterById(id: string, list: Character[]): Character {
  const result = list.find(x => x.id == id)
  return result != null ? result : {} as Character

}