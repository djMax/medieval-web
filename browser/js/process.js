import responses from './responses';

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
  $('#speechResult').text('');
}

function solo(char) {
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

export default async function processSpeech(apiai, voiceSetup, listenAgain) {
  if (apiai.result.actionIncomplete) {
    // Speak the question
    $('#speechResult').text(apiai.result.fulfillment.speech);
    await speak(apiai.result.fulfillment.speech);
    listenAgain();
  } else if (responses[apiai.result.action]) {
    const char = apiai.result.parameters.character.toLowerCase();
    const response = responses[apiai.result.action][char];
    solo(char);
    await readSentences(response, voiceSetup[char], speeds[char]);
    clear();
  } else if (apiai.result.fulfillment && apiai.result.fulfillment.speech) {
    await speak(apiai.result.fulfillment.speech);
  } else {
    alert(apiai);
  }
}