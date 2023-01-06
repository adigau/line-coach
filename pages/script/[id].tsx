import { LiveList, LiveMap } from "@liveblocks/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  DocumentHeader,
  DocumentHeaderSkeleton,
} from "../../components/Document";
import { DocumentLayout } from "../../layouts/Document";
import { Document as DocumentComponent } from "../../components/Document";
import { ErrorLayout } from "../../layouts/Error";
import { updateDocumentName } from "../../lib/client";
import * as Server from "../../lib/server";
import { Presence, RoomProvider } from "../../liveblocks.config";
import { Document, ErrorData } from "../../types";
import { CharacterStorage, LineStorage, SectionStorage } from "../../types/script";
import { NoteStorage, CharacterSelectionStorage, OptionsSelectionStorage, SectionSelectionStorage } from "../../types/storage";

export default function ScriptDocumentView({
  initialDocument,
  initialError,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { id, scene, error: queryError } = router.query;
  const [document, setDocument] = useState<Document | null>(initialDocument);
  const [error, setError] = useState<ErrorData | null>(initialError);

  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = useCallback(() => {
    setMenuOpen((isOpen) => !isOpen);
  }, []);

  // Update document with new name
  async function updateName(name: string) {
    if (!document) {
      return;
    }

    const { data, error } = await updateDocumentName({
      documentId: document.id,
      name: name,
    });

    if (error) {
      return;
    }

    setDocument(data);
  }

  // If error object in params, retrieve it
  useEffect(() => {
    if (queryError) {
      setError(JSON.parse(decodeURIComponent(queryError as string)));
    }
  }, [queryError]);

  if (error) {
    return <ErrorLayout error={error} />;
  }

  if (!document) {
    return <DocumentLayout header={<DocumentHeaderSkeleton />} />;
  }

  const initialStorage = () => ({
    characters: new LiveList<CharacterStorage>([]),
    characterSelections: new LiveMap<string, CharacterSelectionStorage>([]),
    sections: new LiveList<SectionStorage>([]),
    sectionSelections: new LiveMap<string, SectionSelectionStorage>([]),
    optionsSelections: new LiveMap<string, OptionsSelectionStorage>([]),
    lines: new LiveList<LineStorage>([]),
    annotations: new LiveMap<string, NoteStorage>([])
  });

  return (
    <RoomProvider
      id={id as string}
      initialPresence={{} as Presence}
      initialStorage={initialStorage}
    >
      <DocumentLayout
        header={
          <DocumentHeader
            isOpen={isMenuOpen}
            onMenuClick={handleMenuClick}
            document={document}
            onDocumentRename={updateName} />} >
        <DocumentComponent
          scene={scene as string}
          roomDocument={document}
          isOpen={isMenuOpen} />
      </DocumentLayout>
    </RoomProvider>
  );
}

interface ServerSideProps {
  initialDocument: Document | null;
  initialError: ErrorData | null;
  session: Session | null;
}

// Authenticate on server and retrieve the current document
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  req,
  res,
  query,
}) => {
  const documentId = query.id as string;

  const [document, session] = await Promise.all([
    Server.getDocument(req, res, { documentId }),
    Server.getServerSession(req, res),
  ]);

  const { data = null, error = null } = document;

  return {
    props: {
      initialDocument: data,
      initialError: error,
      session: session,
    },
  };
};
