import { useRouter } from "next/router";
import { ComponentProps, useCallback, useEffect, useRef, useState } from "react";
import { Dialog } from "../../primitives/Dialog";
import styles from "./PracticeDialog.module.css";
import { Section } from "../../types/script";
import { Button } from "../../primitives/Button";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import React from "react";
import { DocumentLanguage } from "../../types";
import { supportedVoices } from "../../data/supportedVoices";

interface Props
  extends Omit<ComponentProps<typeof Dialog>, "content" | "title"> {
  title: string;
  section: Section;
  lang: DocumentLanguage;
}

export function PracticeDialog({
  children,
  title,
  section,
  lang,
  ...props
}: Props) {
  const router = useRouter();

  console.log(section.lines.flatMap(x => x.characterId))

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [read, setRead] = useState<string>("");
  const [unread, setUnread] = useState<string>(section.lines[currentIndex].text);

  useEffect(() => {
    const tempSynth = window.speechSynthesis
    tempSynth.onvoiceschanged = () => {
      const newVoices = tempSynth.getVoices().filter(voice => voice.lang.startsWith(lang.substring(0, 2)));
      setVoices(newVoices);
      const lala = newVoices.map(x => { return (x.lang + "\t" + x.name) });
    }
  }, [])

  useEffect(() => {
    setUnread(section.lines[currentIndex].text);
    setRead("");
  }, [currentIndex])

  const speakItem = (voiceId: string, text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);

    const index = 0;
    const voiceDetail = supportedVoices.filter(x => x.id == voiceId)[0]
    const selectedVoice = voices.filter(x => x.lang == voiceDetail.lang && x.name == voiceDetail.name)[0];

    utterance.voice = selectedVoice ?? voices[0];
    utterance.rate = 0.8;
    // utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      setSpeaking(false);
      Next();
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      var read = getReadWords(section.lines[currentIndex].text, event.charIndex, event.charLength);
      var unread = getUnreadWords(section.lines[currentIndex].text, event.charIndex, event.charLength);
      setRead(read);
      setUnread(unread)
    }
  };

  function getReadWords(str: string, pos: number = 0, len: number) {
    return str.substring(0, pos + len)
  }

  function getUnreadWords(str: string, pos: number = 0, len: number) {
    return str.substring(pos + len, str.length + 1)
  }

  function Next(): void {
    console.log("Next");
    Stop();
    // There's no next line
    if (currentIndex >= section.lines.length - 1) return;
    setCurrentIndex(currentIndex + 1)
    //Delay 2 seconds
  }
  function Play(): void {
    console.log("Play");
    var line = section.lines[currentIndex]
    if (line == null)
      return;
    setSpeaking(true);
    speakItem(line.character.voiceId, line.text);
  }
  function Pause(): void {
    console.log("Pause");
    const synth = window.speechSynthesis;
    synth.pause();
    setSpeaking(false);

  }
  function Resume(): void {
    console.log("Resume");
    const synth = window.speechSynthesis;
    synth.resume();
  }
  function Stop() {
    console.log("Stop");
    const synth = window.speechSynthesis;
    synth.cancel();
    setSpeaking(false);
  }
  function Previous(): void {
    console.log("Previous");
    Stop();
    //Check availability of previous track
    setCurrentIndex(currentIndex - 1)
    //Delay 2 seconds
    //Play
  }

  function onPlayPauseClick(): void {
    if (speaking) {
      Pause();
    }
    else {
      const synth = window.speechSynthesis;
      synth.paused ? Resume() : Play();
    }
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      Stop();
    }
  }

  const readTextRef = useRef<HTMLSpanElement>(null);
  const unreadTextRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  return (
    <Dialog onOpenChange={onOpenChange}
      content={
        <div className={styles.dialog}>
          <div ref={wordRef}></div>
          <div className={styles.characterDisplayName}>{section.lines[currentIndex].character.displayName}</div>
          {section.lines[currentIndex].character.isHighlighted ?
            <></>
            :
            <div className={styles.lineText}>
              <span className={styles.readText} ref={readTextRef}>{read}</span>
              <span className={styles.unreadText} ref={unreadTextRef}>{unread}</span>
            </div>
          }
          <div className={styles.buttonGroup}>
            <Button disabled={currentIndex == 0} onClick={Previous}><NavigateBeforeIcon />Previous</Button>
            <Button disabled={section.lines[currentIndex].character.isHighlighted} onClick={onPlayPauseClick}>
              {speaking ? <PauseIcon /> : <PlayArrowIcon />}
            </Button>
            <Button disabled={currentIndex >= section.lines.length - 1} onClick={Next}><NavigateNextIcon />Next</Button>
          </div>
        </div>
      }
      title={title}
      {...props}
    >
      {children}
    </Dialog>
  );
}
