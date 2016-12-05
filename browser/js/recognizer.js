// eslint-disable-next-line new-cap
export const recognizer = new webkitSpeechRecognition();
recognizer.continuous = true;
recognizer.interimResults = true;

recognizer.onerror = (event) => {
  console.error('ON ERROR', event);
};

export function start() {
  console.log('start recognition');
  recognizer.lang = 'en-US';
  recognizer.start();
}
