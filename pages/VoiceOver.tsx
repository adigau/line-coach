
import { TextToSpeech, Positions, Sizes } from 'tts-react'

export default function VoiceOver() {
    return (
        <TextToSpeech
            markTextAsSpoken
            align="vertical"
            size={Sizes.SMALL}
            position={Positions.TL}>
            <p>Je suis content d'être là.</p>
        </TextToSpeech>
    )
}



// fr	French
// fr-BE	French (Belgium)
// fr-CA	French (Canada)
// fr-CH	French (Switzerland)
// fr-FR	French (France)
// fr-LU	French (Luxembourg)
// fr-MC	French (Principality of Monaco)

// en	English
// en-AU	English (Australia)
// en-BZ	English (Belize)
// en-CA	English (Canada)
// en-CB	English (Caribbean)
// en-GB	English (United Kingdom)
// en-IE	English (Ireland)
// en-JM	English (Jamaica)
// en-NZ	English (New Zealand)
// en-PH	English (Republic of the Philippines)
// en-TT	English (Trinidad and Tobago)
// en-US	English (United States)
// en-ZA	English (South Africa)
// en-ZW	English (Zimbabwe)