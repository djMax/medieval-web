import Spinner from 'spin.js';

let interval;
let level = 0;
let inc = .05;
let spinner;

function setScale(level) {
  const transform = `scale3d(${level + 1.0}, ${level + 1.0}, ${level + 1.0})`;

  const circle1 = document.getElementById("mycircle1");
  const circle2 = document.getElementById("mycircle2");
  const circle3 = document.getElementById("mycircle3");

  circle1.style.transform = transform;
  circle1.style.webkitTransform = transform;

  circle2.style.transform = transform;
  circle2.style.webkitTransform = transform;

  circle3.style.transform = transform;
  circle3.style.webkitTransform = transform;
};

export function go() {
  stopSpinner();
  $('#mic-animation-block').css('display', 'block');
  $('#mycircle4').fadeOut();
  interval = setInterval(() => {
    level += inc;
    if (level >= .1 || level <= -.75) {
      inc *= -1;
    }
    setScale(level);
  }, 70);
}

export function stop() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    level = 0;
  }
  $('#mic-animation-block').css('display', 'none');
  $('#mycircle4').fadeIn();
}

export function goSpinner() {
  if (!spinner) {
    var opts = {
      lines: 15 // The number of lines to draw
      , length: 20 // The length of each line
      , width: 8 // The line thickness
      , radius: 35 // The radius of the inner circle
      , scale: 0.85 // Scales overall size of the spinner
      , speed: 0.75 // Rounds per second
      , trail: 30 // Afterglow percentage
    };
    spinner = new Spinner(opts);
  }
  $('#mycircle4').fadeOut();
  spinner.spin($('#speakButton')[0]);
}

export function stopSpinner() {
  if (spinner) {
    spinner.stop();
    $('#mycircle4').fadeIn();
  }
}