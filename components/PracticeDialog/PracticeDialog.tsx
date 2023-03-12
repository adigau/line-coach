import React, { useEffect, useState } from "react";
import styles from "./PracticeDialog.module.css";
import { Section } from "../../types/script";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Button } from "../../primitives/Button";
import { Dialog } from "../../primitives/Dialog";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

type PracticeDialogProps = {
    section: Section
    practiceMode: boolean,
    onPracticeClick: () => void
};

export function PracticeDialog({
    section,
    practiceMode,
    onPracticeClick,
}: PracticeDialogProps) {

    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [speaking, setSpeaking] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

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

        utterance.onend = () => { setSpeaking(false) };
    };


    function randomInteger(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function onPreviousClick(): void {
        stopSpeaking();
        setCurrentIndex(currentIndex - 1);
    }
    function onPlayPauseClick(): void {
        if (speaking) {
            stopSpeaking();
        }
        else {
            var line = section.lines[currentIndex]
            if (line == null)
                return;
            setSpeaking(true);
            speakItem(line.text);
        }
    }
    function stopSpeaking() {
        const synth = window.speechSynthesis;
        synth.cancel();
        setSpeaking(false);
    }

    function onNextClick(): void {
        stopSpeaking();
        setCurrentIndex(currentIndex + 1)
    }

    return (

        // <Dialog title={"Practice:" + section.displayName} content={undefined} />


        <Modal
            open={practiceMode}
            onClose={onPracticeClick}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={styles.boxModal}>
                <div className={styles.characterDisplayName}>{section.lines[currentIndex].character.displayName}</div>
                <div className={styles.lineText}>{section.lines[currentIndex].text}</div>
                <div className={styles.buttonGroup}>
                    <Button disabled={currentIndex == 0} onClick={onPreviousClick}><NavigateBeforeIcon />Previous</Button>
                    <Button onClick={onPlayPauseClick}>
                        {speaking ? <PauseIcon /> : <PlayArrowIcon />}
                    </Button>
                    <Button disabled={currentIndex >= section.lines.length - 1} onClick={onNextClick}><NavigateNextIcon />Next</Button>
                </div>
            </Box>
        </Modal>
    );
}