- [LineCoach](#linecoach)
  - [Why](#why)
    - [Current features](#current-features)
    - [Roadmap](#roadmap)
  - [Installation](#installation)
  - [Contributing](#contributing)

# LineCoach

LineCoach is a tool designed to help actors memorize their lines more
efficiently.

Learning lines is a tedious task that can take a lot of time. Most actors hate
that part and want to focus solely on the acting one. LineCoach make this
quicker, easier and funnier. LineCoach uses advanced techniques to assist actors
in remembering their lines, reducing the stress and frustration associated with
the memorization process. You can work on your own or with your partners if
they're online, making the learning process collaborative and human-centered.
This makes LineCoach an essential tool for actors who want to focus on their
craft and improve their performance.

## Why

> The gist of the matter is not in the text. The text will come of itself when I
> feel the role. _Konstantin Stanislavski_

Learning a text is too complicated, and the experience for the actor needs to be
fixed and updated.

The intense emotions and aesthetics that an actor offers on stage cannot be
replaced by artificial intelligence. Still, technology can help the actor get
closer to mastering their text to focus on the actual acting and genuine
emotions.

When a script is printed, it's easier to remember, but it won't be available on
stage. An actor needs to be able to recite their lines in any situation, with
any style, and continue them from any phrase. Everyone has a different memory;
they need to find the proper technique and tool to learn the text.

### Current features

- See data about a script, like the list of characters, and for each one of them
  the number of lines and words
- Select the characters you're impersonating so that they visually stand-out
- Hide the lines of your characters, so that you can truly practice, with the
  ability to temporarily show one that you have doubts about
- For each line, you can take notes to help your next practice
- When someone is online at the same time as you, you'll see a green dot next to
  their character name.
- If everybody from a scene is online, it will display a green dot next to it.
- Print a text in the mode you chose (showing or not your lines, displaying or
  not the notes...)

### Roadmap

- At any time, you can start a practice session. Artificial intelligence will
  read lines from other characters, and you'll have time to say yours. You can
  pause and resume at any time.
- You can share a script with anyone at any time, or make it public if your
  partners don't have emails
- You can start an audio huddle if you want to practice with your partners. You
  will see your partners' lines, and they'll see yours. That way, you can
  correct each other's and practice your lines. If someone is missing from a
  scene, an artificial intelligence will read their lines

## Installation

- Install all dependencies with `npm install`
- Create an account on [liveblocks.io](https://liveblocks.io/dashboard)
- Copy your **secret** key from the
  [dashboard](https://liveblocks.io/dashboard/apikeys)
- Create an `.env.local` file and add your **secret** key as the
  `LIVEBLOCKS_SECRET_KEY` environment variable
- Run
  [this Postman's collection of API](https://www.postman.com/linecoach/workspace/linecoach/overview)
  to initialize your Liveblocks' storage with sample data (select the
  `Localhost` environment, and don't forget to provide your
  `LIVEBLOCKS_SECRET_KEY`)
- Run `npm run dev` and go to [http://localhost:3000](http://localhost:3000)

## Contributing

LineCoach is currently only available on a desktop, and the vision is to
integrate collaborative experiences with [Liveblocks](https://liveblocks.io) and
voice-over technologies with Google's
[Text-to-Speech client libraries](https://cloud.google.com/text-to-speech/docs/libraries).

Here's where we need help:

- Implement voice-over features
- Implement a huddle feature
- Porting LineCoach as a native app for both Android and iOS
- Design those features with amazing UX/UI
- Development, code refactoring, code review

🙏
