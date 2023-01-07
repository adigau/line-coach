import { ComponentProps, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Document.module.css";
import { CharacterSelectionStorage, OptionsSelectionStorage } from "../../types/storage";
import { users } from "../../data/users";
import { useMutation, useRoom, useSelf, useStorage } from "../../liveblocks.config";
import { User } from "../../types";
import { ScriptType, Section, Character, Line } from "../../types/script";
import { Spinner } from "../../primitives/Spinner";
import { Sidebar } from "../Sidebar";
import { useRouter } from "next/router";
import Head from 'next/head'
import { Document } from "../../types";
import { ScriptNavigator } from "../ScriptNavigator";
import { useSession } from "next-auth/react";
import { ClientSideSuspense } from "@liveblocks/react";

interface Props extends ComponentProps<"div"> {
  scene?: string;
  isOpen: boolean;
  roomDocument?: Document;
}

export function Document({ ...props }: Props) {
  const { data: session } = useSession();

  const loading = (
    <div className={styles.loading}>
      <Spinner size={24} />
    </div>
  );

  return (
    <ClientSideSuspense fallback={loading}>
      {() =>
        <Practice {...props} />
      }
    </ClientSideSuspense>
  );
}

export function Practice({ isOpen, roomDocument, className, scene, ...props }: Props) {
  //////// Next - Router
  const { asPath } = useRouter();

  //////// Liveblocks - Presence
  const self = useSelf()

  //////// Liveblocks - Storage
  const characterSelections = useStorage((root) => root.characterSelections.get(self.id));
  const optionsSelections = useStorage((root) => root.optionsSelections.get(self.id));
  const charactersStorage = useStorage((root) => root.characters);
  const sectionsStorage = useStorage((root) => root.sections);
  const linesStorage = useStorage((root) => root.lines);

  //////// Liveblocks - Mutation
  const addOrUpdateOptionsSelection = useMutation(({ storage }, options: OptionsSelectionStorage) => {
    storage.get("optionsSelections").set(options.userId, options)
  }, []);
  const addOrUpdateCharacterSelection = useMutation(({ storage }, characterSelection: CharacterSelectionStorage) => {
    storage.get("characterSelections").set(characterSelection.userId, characterSelection)
  }, []);
  //////// States
  const [sections, setSections] = useState<Section[]>()
  const [characters, setCharacters] = useState<Character[]>()
  const [isHiddenLines, setIsHiddenLines] = useState(optionsSelections != null ? optionsSelections.isHiddenLines : false)
  const [isAnnotationMode, setIsAnnotationMode] = useState(optionsSelections != null ? optionsSelections.isAnnotationMode : false)
  const [isAnnotationModeOnlyMine, setIsAnnotationModeOnlyMine] = useState(optionsSelections != null ? optionsSelections.isAnnotationModeOnlyMine : true)
  const [searchTerm, setSearchTerm] = useState<string>("")

  //////// Events
  const onSearchTermChanged = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchTerm(e.target.value) }
  const isHiddenLinesChanged = (data: boolean) => setIsHiddenLines(data)
  const isAnnotationModeChanged = (data: boolean) => setIsAnnotationMode(data)
  const isAnnotationModeOnlyMineChanged = (data: boolean) => setIsAnnotationModeOnlyMine(data)
  const castChanged = (data: Character[]) => {
    setCharacters(data)

    const userToCharacters: CharacterSelectionStorage =
    {
      userId: self.id,
      characterIds: data.filter(c => c.isHighlighted).map(c => c.id)
    }
    addOrUpdateCharacterSelection(userToCharacters)
  }

  //////// useCallBack
  function loadScript() {
    const castEnriched = charactersStorage.map(x => (
      {
        isHighlighted: getIsCharacterHighlightedFromStorage(characterSelections, x.id),
        ...x
      }))

    const sectionsEnriched = sectionsStorage.map(x => (
      {
        href: "section" + x.id,
        lines: linesStorage.filter(y => y.sectionId == x.id)
          .map(x => (
            {
              href: "line" + x.id + "_" + x.characterId,
              character: getCharacterById(x.characterId, castEnriched),
              ...x
            } as Line)),
        ...x
      } as Section))

    setSections(sectionsEnriched)
    setCharacters(castEnriched)
  }

  //////// useEffect
  useEffect(() => {
    const optionsSelection: OptionsSelectionStorage = {
      userId: self.id,
      isHiddenLines: isHiddenLines,
      isAnnotationMode: isAnnotationMode,
      isAnnotationModeOnlyMine: isAnnotationModeOnlyMine,
    }
    addOrUpdateOptionsSelection(optionsSelection)

    loadScript()
  }, [])

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
  }, [sections, characters, asPath, hash, scene]);

  if (sections == null || characters == null) {
    return (<Spinner />)
  }

  return (
    <>
      <Head>
        <title>{roomDocument != null ? roomDocument.name : "LineCoach"}</title>
      </Head>
      <div className={clsx(className, styles.container)} {...props}>
        <aside className={styles.aside} data-open={isOpen || undefined}>
          <Sidebar
            sections={sections}
            cast={characters}
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
            sections={sections}
            characters={characters}
            scene={scene}
            searchTerm={searchTerm}
            isHiddenLines={isHiddenLines}
            isAnnotationMode={isAnnotationMode}
            isAnnotationModeOnlyMine={isAnnotationModeOnlyMine}
          />
        </main>
      </div>
    </>
  );
}

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