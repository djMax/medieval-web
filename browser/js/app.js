import request from 'superagent';
import * as animate from './animate';
import interpret from './apiai.js';
import { processSpeech, setCharacter, solo } from './process';
import { refresh } from './responses';

const CHARACTERS = ['isabella', 'sierida', 'brian'];
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
}

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
    const result = await interpret(finalTranscript);
    processSpeech(result, voiceSetup, start);
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

const autoQuestion = {
  food: 'what type of food do you like?',
  marriage: 'were you married',
  education: 'do you like school?',
  childhood: 'what are children like?',
  religion: 'what is your religion?',
  clothing: 'what type of clothes do you wear?',
  weapons: 'what weapons did they use?',
  torture: 'name some forms of torture.',
}

$('#speechResult').on('click', 'a', async function clickQuestion(e) {
  e.preventDefault();
  const link = $(this).text();

  if (autoQuestion[link]) {
    const result = await interpret(autoQuestion[link]);
    processSpeech(result, voiceSetup, start);
  }
});

$('#characters>div>div.char').click(async function charClick(e) {
  e.preventDefault();
  for (const c of CHARACTERS) {
    if ($(this).hasClass(c)) {
      setCharacter(c);
      solo(c);
      return;
    }
  }
});

function ready() {
  $('#speechResult').html('ask about <a href="#">food</a>, '+
  '<a href="#">marriage</a>, <a href="#">education</a>, ' +
  '<a href="#">childhood</a>, <a href="#">clothing</a> '+
  'or <a href="#">religion</a>');
}

$(async () => {
  await refresh();
  $('#speechResult')[0].reset = ready;
  $('#speechResult')[0].reset();
  $('#speakButton').click(() => {
    if (recognizing) {
      recognizing = false;
      recognizer.stop();
    } else {
      start();
    }
  });
});
