import request from 'superagent';
import * as animate from './animate';
import processSpeech from './process';
import uuid from 'uuid';

// Isabella - Karen
// Siereda - Victoria
// Brian - Daniel
const voiceSetup = {
  isabella: 'karen',
  sierida: 'victoria',
  brian: 'daniel',
};

speechSynthesis.onvoiceschanged = async function () {
  const voices = speechSynthesis.getVoices();

  for (const [char, voiceName] of Object.entries(voiceSetup)) {
    for (const voice of voices) {
      if (voice.name.toLowerCase() === voiceName) {
        voiceSetup[char] = voice;
      }
    }
  }
  console.log(voiceSetup);
}

const token = 'd34008bf305c404bb394929e0e41aef7';
const sessionId = uuid.v4();

let recognizing = false;
let finalTranscript;

const recognizer = new webkitSpeechRecognition();
recognizer.continuous = true;
recognizer.interimResults = true;

function start() {
  console.log('start recognition');
  recognizer.lang = 'en-US';
  recognizing = true;
  recognizer.start();
}

recognizer.onstart = () => {
  console.log('ON START');
  animate.go();
};

recognizer.onerror = (event) => {
  console.error('ON ERROR', event);
};

recognizer.onend = async () => {
  recognizing = false;
  animate.stop();

  if (finalTranscript) {
    animate.goSpinner();
    const { body: apiai } = await request
      .get('https://api.api.ai/api/query?v=20150910&lang=en')
      .query({
        query: finalTranscript,
        sessionId,
      })
      .set('Authorization', `Bearer ${token}`);
    processSpeech(apiai, voiceSetup, start);
    animate.stopSpinner();
  }
}

recognizer.onresult = (event) => {
  let isFinal;
  let interimTranscript = '';
  finalTranscript = '';
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      isFinal = true;
      console.log('FINAL', transcript);
      finalTranscript = transcript;
    } else {
      interimTranscript += transcript;
    }
  }
  const sr = $('#speechResult');
  sr.stop(true).fadeOut(0, () => {
    sr.text(isFinal ? finalTranscript : interimTranscript);
    sr.fadeIn();
  });
  if (isFinal) {
    recognizer.stop();
  }
}

$('#speakButton').click(() => {
  if (recognizing) {
    recognizing = false;
    recognizer.stop();
  } else {
    start();
  }
});
