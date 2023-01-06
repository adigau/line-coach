import React, { useEffect, useState } from "react";
import styles from "./Note.module.css";
import clsx from "clsx";
import { TextArea2 } from "../../primitives/TextArea2";
import { useMutation, useStorage } from "../../liveblocks.config";
import { users } from "../../data/users";
import { User } from "../../types";
import { NoteStorage } from "../../types/storage";

export enum NoteType {
  Others,
  Yours,
}

function generateNoteKey(userId: string, lineId: string): string {
  return "note-line" + lineId + "-by" + userId;
}

type NoteProps = {
  userId: string,
  lineId: string,
  type: NoteType
};

export function Note(props: NoteProps) {
  const {
    userId,
    lineId,
    type
  } = props;

  const [key] = useState<string>(generateNoteKey(userId, lineId));
  const [user] = useState<Omit<User, "color"> | undefined>(users.find(x => x.id == userId));
  const [draftAnnotation, setDraftAnnotation] = useState<string>("");
  const annotation = useStorage((root) => root.annotations.get(key))

  useEffect(() =>
    setDraftAnnotation(annotation?.text ?? "")
    , [annotation])

  const addOrUpdateAnnotation = useMutation(({ storage, self }, value: string) => {
    storage.get("annotations").set(key, { lineId: lineId, userId: userId, text: value } as NoteStorage)
  }, []);

  return (
    <fieldset key={key} id={key} className={clsx(styles.annotation, type == NoteType.Yours ? styles.editable : styles.readonly, draftAnnotation == "" ? styles.isEmpty : styles.isNotEmpty)}>
      <legend>{type == NoteType.Others ? "By " + user?.name : "Your notes"}</legend>
      <TextArea2
        className={styles.annotationText}
        defaultValue={draftAnnotation}
        onChange={(e) => { addOrUpdateAnnotation(e.target.value) }}
        disabled={type == NoteType.Others}
      />
    </fieldset>);
}
