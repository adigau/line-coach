import React from "react";
import styles from "./Note.module.css";
import { Note } from "../../types/storage";
import clsx from "clsx";
import { TextArea2 } from "../../primitives/TextArea2";

export enum NoteType {
  Others,
  Yours,
}

type NoteProps = {
  note: Note,
  type: NoteType,
  onNoteChange?: (value: string) => void
};


export function Note(props: NoteProps) {
  const {
    note,
    type,
    onNoteChange = () => { }
  } = props;

  return (
    <fieldset key={note.key} id={note.key} className={clsx(styles.annotation, type == NoteType.Yours ? styles.editable : styles.readonly)}>
      <legend>{type == NoteType.Others ? note.user.name : "Your notes"}</legend>
      <TextArea2
        className={styles.annotationText}
        defaultValue={note.text}
        onChange={(e) => { onNoteChange(e.target.value) }}
        disabled={type == NoteType.Others}
      />
    </fieldset>);
}
