import React, { useEffect, useState } from "react";
import styles from "./Line.module.css";
import Switch from "@mui/material/Switch";
import { Line } from "../../types/script";
import { AnnotationType, CharacterSelectionType } from "../../types/storage";
import { useOthers, useSelf, useStorage } from "../../liveblocks.config";
import clsx from "clsx";
import { User } from "../../types";
import { shallow } from "@liveblocks/react";

type LineProps = {
  line: Line;

  currentUserId: string;

  isHiddenLines: boolean;
  isAnnotationMode: boolean;
  isAnnotationModeOnlyMine: boolean;

  currentUserAnnotation: AnnotationType;
  otherUsersAnnotations: AnnotationType[];
  onAddOrUpdateAnnotation: Function;
};

function renderCharacterInfo(line: Line) {
  return (
    <span className={styles.characterInfo}>
      <span className={styles.character}>
        <a href={line.href}>{line.character?.displayName}: </a>
      </span>
    </span>
  );
}
function renderOtherAnnotation(
  lineId: string,
  annotations: AnnotationType[],
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
          ></textarea>
        </fieldset>
      );
    });
}

export function Line(props: LineProps) {
  const {
    line,
    currentUserId,
    isHiddenLines,
    isAnnotationMode,
    isAnnotationModeOnlyMine,
    currentUserAnnotation,
    otherUsersAnnotations,
    onAddOrUpdateAnnotation,
  } = props;

  const self = useSelf();
  const others = useOthers();

  const othersCharacterSelections: CharacterSelectionType[] = useStorage(
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

  const [, setWatchers] = useState<(User | null)[]>();

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

  let updatedUserAnnotation = currentUserAnnotation;

  if (updatedUserAnnotation == null) {
    updatedUserAnnotation = {
      key: currentUserId + "_" + line.id,
      lineId: line.id,
      text: "",
      userId: currentUserId,
    };
  }
  const renderYourAnnotation = (lineId: string, annotation: AnnotationType) => {
    return (
      <fieldset
        id={"yourAnnotationFieldset-" + lineId}
        className={styles.lineAnnotationsCurrentUser}
      >
        <legend>Your notes</legend>
        <textarea
          className={styles.annotationText}
          onChange={(event) => {
            onAnnotationChange(event, annotation);
          }}
          defaultValue={annotation.text}
        ></textarea>
      </fieldset>
    );
  };
  const onAnnotationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    a: AnnotationType
  ) => {
    a.text = e.target.value;
    onAddOrUpdateAnnotation(a);
  };

  const onRevealerButtonClick = (e: React.ChangeEvent<any>) => {
    setIsTextForcedVisible(e.target.checked);
  };

  const isTextVisible =
    !line.character?.isHighlighted || isTextForcedVisible || !isHiddenLines;

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
          otherUsersAnnotations,
          isAnnotationModeOnlyMine
        )}
        {renderYourAnnotation(line.id, updatedUserAnnotation)}
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
