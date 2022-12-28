import React, { useEffect, useState } from "react";
import styles from "./Line.module.css";
import Switch from "@mui/material/Switch";
import { Line } from "../../types/script";
import { AnnotationStorage, CharacterSelectionStorage } from "../../types/storage";
import { useMutation, useOthers, useSelf, useStorage } from "../../liveblocks.config";
import clsx from "clsx";
import { User } from "../../types";
import { shallow } from "@liveblocks/react";

type LineProps = {
  line: Line;

  isHiddenLines: boolean;
  isAnnotationMode: boolean;
  isAnnotationModeOnlyMine: boolean;
};

function renderOtherAnnotation(
  lineId: string,
  annotations: AnnotationStorage[],
  isAnnotationModeOnlyMine: boolean
) {
  if (annotations == null || isAnnotationModeOnlyMine) return;
  else
    return annotations.map((a) => {
      const key = "othersAnnotationFieldset-" + lineId;
      return (
        <fieldset key={key} id={key} className={styles.lineAnnotationsOthers}>
          <legend>{a.userId}</legend>
          <textarea
            className={styles.annotationText}
            defaultValue={a.text}
            disabled={true}
          />
        </fieldset>
      );
    });
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
  const annotations = useStorage((root) => root.annotations.filter(x => x.lineId == line.id), shallow);

  const [draftAnnotation] = useState<string>(annotations.filter(x => x.userId == self.id).map(x => x.text)[0] ?? "");
  const [watchers, setWatchers] = useState<(User | null)[]>();

  //TODO: Understand why others only receive updates when a new annotation is added witht he first letter, but not the rest when more text is typed
  const addOrUpdateAnnotation = useMutation(({ storage, self }, value: string) => {
    const newAnnotation = { lineId: line.id, userId: self.id, text: value } as AnnotationStorage
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
    return (
      <fieldset
        id={"yourAnnotationFieldset-" + line.id}
        className={styles.lineAnnotationsCurrentUser}
      >
        <legend>Your notes</legend>
        <textarea
          className={styles.annotationText}
          onChange={(e) => { addOrUpdateAnnotation(e.target.value) }}
          defaultValue={draftAnnotation} />
      </fieldset>
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
          <>
            <a href={"#" + line.href}>{line.character?.displayName}
              {displayPresenceIndicatorCharacter()}: </a>
          </>
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
          line.id,
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
