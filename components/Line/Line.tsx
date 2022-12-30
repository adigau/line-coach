import React, { useEffect, useState } from "react";
import styles from "./Line.module.css";
import Switch from "@mui/material/Switch";
import { Line } from "../../types/script";
import { Note, NoteStorage, CharacterSelectionStorage } from "../../types/storage";
import { useMutation, useOthers, useSelf, useStorage } from "../../liveblocks.config";
import clsx from "clsx";
import { User } from "../../types";
import { shallow } from "@liveblocks/react";
import { LinkIcon } from "../../icons";
import { users } from "../../data/users";
import { Note as NoteComponent, NoteType } from "../Note";

type LineProps = {
  line: Line;

  isHiddenLines: boolean;
  isAnnotationMode: boolean;
  isAnnotationModeOnlyMine: boolean;
};

function renderOtherAnnotation(
  annotations: Note[],
  isAnnotationModeOnlyMine: boolean
) {
  if (annotations == null || isAnnotationModeOnlyMine)
    return;
  else
    return annotations.map((a) => { return <NoteComponent key={a.key} note={a} type={NoteType.Others} /> });
}

export function Line(props: LineProps) {
  const {
    line,
    isHiddenLines,
    isAnnotationMode,
    isAnnotationModeOnlyMine
  } = props;

  const self = useSelf();
  const others = useOthers();
  const annotations = useStorage((root) => root.annotations
    .filter(x => x.lineId == line.id)
    .map(x => {
      return { user: users.filter(y => y.id == x.userId)[0], key: generateNoteKey(x.userId, x.lineId), ...x } as Note
    })
    , shallow);

  const [draftAnnotation] = useState<string>(annotations.filter(x => x.userId == self.id).map(x => x.text)[0] ?? "");
  const [watchers, setWatchers] = useState<(User | null)[]>();

  //TODO: Understand why others only receive updates when a new annotation is added witht he first letter, but not the rest when more text is typed
  const addOrUpdateAnnotation = useMutation(({ storage, self }, value: string) => {
    const newAnnotation = { lineId: line.id, userId: self.id, text: value } as NoteStorage
    const index = storage.get("annotations").findIndex(x => x.userId == newAnnotation.userId && x.lineId == newAnnotation.lineId)
    if (index < 0)
      storage.get("annotations").push(newAnnotation)
    else
      storage.get("annotations").set(index, newAnnotation)
  }, []);

  const othersCharacterSelections: CharacterSelectionStorage[] = useStorage(
    (root) =>
      Array.from(root.characterSelections.values())
        .filter(
          (x) =>
            x.userId != self.id &&
            x.characterIds.some((y) => y == line.characterId)
        )
        .filter((x) => others.some((y) => y.id == x.userId)),
    shallow
  );

  useEffect(() => {
    const fetchData = () => {
      const tempWatchers = othersCharacterSelections.map((x) => {
        const user = others.filter((y) => y.id == x.userId)[0];
        return {
          id: user.id,
          name: user.info.name,
          avatar: user.info.avatar,
        } as User;
      });
      setWatchers(tempWatchers);
    };
    fetchData();
  }, [othersCharacterSelections, others]);

  const [isTextForcedVisible, setIsTextForcedVisible] = useState(false);


  const renderYourAnnotation = () => {
    const note =
      {
        key: generateNoteKey(self.id, line.id),
        lineId: line.id,
        text: draftAnnotation,
        userId: self.id,
        user: users.filter(y => y.id == self.id)[0]
      } as Note

    return (
      <NoteComponent key={note.key} note={note} type={NoteType.Yours} onNoteChange={addOrUpdateAnnotation} />

    );
  };

  const displayPresenceIndicatorCharacter = () => {
    if (watchers == null || watchers.length <= 0)
      return

    const title = watchers.map(x => x?.name).join(", ")

    return (
      <div className={styles.presenceIndicatorContainer} title={title}>
        <div className={styles.presenceIndicator}>&nbsp;</div>
      </div>
    )
  }

  function renderCharacterInfo(line: Line) {
    return (
      <span className={styles.characterInfo}>
        <span className={styles.character}>
          <a className={styles.characterLink} href={"#" + line.href}>
            <span className={styles.characterLinkIconContainer}>
              <span className={styles.characterLinkIcon}>
                <LinkIcon />
              </span>
            </span>
            {line.character?.displayName}
            {displayPresenceIndicatorCharacter()}:
          </a>
        </span>
      </span>
    );
  }

  const onRevealerButtonClick = (e: React.ChangeEvent<any>) => { setIsTextForcedVisible(e.target.checked); };

  const isTextVisible = !line.character?.isHighlighted || isTextForcedVisible || !isHiddenLines;

  return (
    <div id={line.href} key={line.href} className={styles.line}>
      <div
        className={clsx(
          styles.lineAnnotations,
          !isAnnotationMode && styles.hide
        )}
      >
        {renderOtherAnnotation(
          annotations.filter(x => x.userId != self.id),
          isAnnotationModeOnlyMine
        )}
        {renderYourAnnotation()}
      </div>
      <div
        className={clsx(
          styles.replica,
          line.character?.isHighlighted && styles.highlighted
        )}
      >
        {renderCharacterInfo(line)}
        <span
          className={clsx(
            styles.revealer,
            (!line.character?.isHighlighted || !isHiddenLines) && styles.hide
          )}
        >
          <Switch
            onClick={(event) => onRevealerButtonClick(event)}
            size="small"
          />
        </span>
        <span className={clsx(styles.text, !isTextVisible && styles.hide)}>
          {line.text}
        </span>
      </div>
    </div>
  );
}

function generateNoteKey(userId: string, lineId: string): string {
  return "note-line" + lineId + "-by" + userId;
}

