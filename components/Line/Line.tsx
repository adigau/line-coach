import React, { useEffect, useState } from "react";
import styles from "./Line.module.css";
import Switch from "@mui/material/Switch";
import { Line } from "../../types/script";
import { NoteStorage, CharacterSelectionStorage } from "../../types/storage";
import { useOthers, useSelf, useStorage } from "../../liveblocks.config";
import clsx from "clsx";
import { User } from "../../types";
import { shallow } from "@liveblocks/react";
import { LinkIcon } from "../../icons";
import { Note as NoteComponent, NoteType } from "../Note";

type LineProps = {
  line: Line;

  isHiddenLines: boolean;
  isAnnotationMode: boolean;
  isAnnotationModeOnlyMine: boolean;
};

function renderOtherAnnotation(
  annotations: NoteStorage[],
  isAnnotationModeOnlyMine: boolean
) {
  if (annotations == null || isAnnotationModeOnlyMine)
    return;
  else
    return annotations.map((a) => { return <NoteComponent lineId={a.lineId} userId={a.userId} type={NoteType.Others} /> });
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

  const [watchers, setWatchers] = useState<(User | null)[]>();

  const annotations = useStorage((root) => Array.from(root.annotations.values()).filter(x => x.lineId == line.id))

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
      <NoteComponent
        lineId={line.id}
        userId={self.id}
        type={NoteType.Yours} />
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
          annotations?.filter(x => x.userId != self.id),
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