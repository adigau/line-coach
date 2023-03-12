import { useRouter } from "next/router";
import { ComponentProps, useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Dialog } from "../../primitives/Dialog";
import styles from "./PracticeDialog.module.css";
import { Section } from "../../types/script";
import { Button } from "../../primitives/Button";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

interface Props
  extends Omit<ComponentProps<typeof Dialog>, "content" | "title"> {
  title: string;
  section: Section;
}

export function PracticeDialog({
  children,
  title,
  section,
  ...props
}: Props) {
  const router = useRouter();

  const { data: session } = useSession();

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  console.log("currentIndex: " + currentIndex)

  useEffect(() => {
    const tempSynth = window.speechSynthesis
    tempSynth.onvoiceschanged = () => {
      console.log("🗣️ onvoiceschanged")
      const newVoices = tempSynth.getVoices().filter(voice => voice.lang.startsWith("fr-FR"));
      setVoices(newVoices);
    }
  }, [])

  const speakItem = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);

    // const index = randomInteger(0, voices.length);

    const index = 0;
    const selectedVoice = voices[index];

    utterance.voice = selectedVoice;
    // utterance.rate = 0.6;
    // utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      console.log("onend");
      setSpeaking(false);
      Next();
    };
  };


  function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  function Next(): void {
    console.log("Next");
    Stop();
    //Check availability of next track
    setCurrentIndex(currentIndex + 1)
    //Delay 2 seconds
    // Play();
  }
  function Play(): void {
    console.log("Play");
    var line = section.lines[currentIndex]
    if (line == null)
      return;
    setSpeaking(true);
    speakItem(line.text);
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


  return (
    <Dialog
      content={
        <div className={styles.dialog}>
          <div className={styles.characterDisplayName}>{section.lines[currentIndex].character.displayName}</div>
          <div className={styles.lineText}>{section.lines[currentIndex].text}</div>
          <div className={styles.buttonGroup}>
            <Button disabled={currentIndex == 0} onClick={Previous}><NavigateBeforeIcon />Previous</Button>
            <Button onClick={onPlayPauseClick}>
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
