import interpret from './apiai.js';
import { responses } from './responses';
import { recognizer } from './recognizer';

let currentCharacter;
let lastWasIncomplete = false;

const speeds = {
  isabella: 0.95,
  sierida: 1,
  brian: 0.8,
};

function speak(text, voice, speed) {
  let finished = false;
  return new Promise((accept, reject) => {
    const u = new SpeechSynthesisUtterance();
    u.text = text;
    if (voice) {
      u.voice = voice;
    } else {
      u.lang = 'en';
    }
    if (speed) {
      u.rate = speed;
    } else {
      console.error('FAILED SPEED', text, voice);
    }
    u.onend = () => {
      if (!finished) {
        finished = true;
        accept();
      }
    };
    setTimeout(() => {
      if (!finished) {
        finished = true;
        accept();
      }
    }, 5000);

    u.onerror = reject;
    speechSynthesis.speak(u);
  });
}

async function readSentences(sentences, voice, speed) {
  const sentenceArray = sentences.split(/[!\.]/);
  console.error('Reading', sentenceArray);
  for (const s of sentenceArray) {
    if (s.length === 0) {
      continue;
    }
    $('#speechResult').text(s);
    for (let i = 0; i < 5; i++) {
      try {
        await speak(s, voice, speed);
        break;
      } catch (error) {
        console.error('Speech failed', error);
      }
    }
  }
  $('#speechResult')[0].reset();
}

export function solo(char) {
  for (const c of ['isabella', 'brian', 'sierida']) {
    if (char !== c) {
      $(`div.${c}`).fadeOut('slow', () => $('div.solo').show());
    }
  }
}

function clear() {
  $('div.solo').hide();
  for (const c of ['isabella', 'brian', 'sierida']) {
    $(`div.${c}`).fadeIn();
  }
}

export async function setCharacter(c) {
  currentCharacter = c;
  if (lastWasIncomplete) {
    lastWasIncomplete = false;
    recognizer.stop();
    const result = await interpret(currentCharacter);
    processSpeech(result, voiceSetup, listenAgain);
  }
}

export async function processSpeech(apiai, voiceSetup, listenAgain) {
  if (apiai.result.actionIncomplete) {
    lastWasIncomplete = true;
    // Speak the question
    if (currentCharacter) {
      const result = await interpret(currentCharacter);
      processSpeech(result, voiceSetup, listenAgain);
    } else {
      $('#speechResult').text(apiai.result.fulfillment.speech);
      await speak(apiai.result.fulfillment.speech);
      listenAgain();
    }
    return;
  }

  lastWasIncomplete = false;
  if (apiai.result.parameters && apiai.result.parameters.character) {
    currentCharacter = apiai.result.parameters.character.toLowerCase();

    if (responses[currentCharacter]) {
      const response = responses[currentCharacter][apiai.result.action];
      solo(currentCharacter);
      await readSentences(response, voiceSetup[currentCharacter], speeds[currentCharacter]);
      clear();
      return;
    }
  }

  if (apiai.result.fulfillment && apiai.result.fulfillment.speech) {
    await speak(apiai.result.fulfillment.speech);
  } else {
    console.log('Unknown result type', apiai);
  }
}