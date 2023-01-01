import { useRouter } from "next/router";
import { ComponentProps } from "react";
import { DOCUMENT_URL } from "../../constants";
import { PlusIcon } from "../../icons";
import { createDocument } from "../../lib/client";
import { Button } from "../../primitives/Button";
import { Popover } from "../../primitives/Popover";
import {
  Document,
  DocumentGroup,
  DocumentType,
  DocumentLanguage,
  DocumentUser,
} from "../../types";
import styles from "./DocumentCreatePopover.module.css";

interface Props extends Omit<ComponentProps<typeof Popover>, "content"> {
  documentName?: Document["name"];
  draft: Document["draft"];
  groupIds?: DocumentGroup["id"][];
  userId: DocumentUser["id"];
}

export function DocumentCreatePopover({
  documentName = "Untitled",
  groupIds,
  userId,
  draft,
  children,
  ...props
}: Props) {
  const router = useRouter();

  // Create a new document, then navigate to the document's URL location
  async function createNewDocument(name: string, type: DocumentType, lang: DocumentLanguage) {
    const { data, error } = await createDocument({
      name: documentName,
      type: type,
      lang: lang,
      userId: userId,
      draft: draft,
      groupIds: draft ? undefined : groupIds,
    });

    if (error || !data) {
      return;
    }

    const newDocument: Document = data;
    router.push(DOCUMENT_URL(newDocument.type, newDocument.id));
  }

  return (
    <Popover
      content={
        <div className={styles.popover}>
          <Button
            icon={<PlusIcon />}
            onClick={() => {
              createNewDocument(documentName, "play", "en-US");
            }}
            variant="subtle"
          >
            Play
          </Button>
          <Button
            icon={<PlusIcon />}
            onClick={() => {
              createNewDocument(documentName, "sitcom", "en-US");
            }}
            variant="subtle"
          >
            Sitcom
          </Button>
          <Button
            icon={<PlusIcon />}
            onClick={() => {
              createNewDocument(documentName, "movie", "en-US");
            }}
            variant="subtle"
          >
            Movie
          </Button>
          <Button
            icon={<PlusIcon />}
            onClick={() => {
              createNewDocument(documentName, "qa", "en-US");
            }}
            variant="subtle"
          >
            QA
          </Button>
        </div>
      }
      modal
      side="bottom"
      {...props}
    >
      {children}
    </Popover>
  );
}
