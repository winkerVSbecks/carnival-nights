import anime from 'animejs/lib/anime.es.js';
import Random from 'canvas-sketch-util/random';
import Color from 'canvas-sketch-util/color';
import {
  createParticle,
  updateParticle,
  drawParticle,
  resetParticles,
} from './confetti-particle';

const colors = [
  '#FB3C52',
  '#FB552A',
  '#57BAFA',
  '#F6FEA6',
  '#FC4654',
  '#FED039',
  '#B6A8DE',
  '#FB5E95',
  '#FD8533',
  '#54A976',
  '#2D76C7',
  '#FC4D5E',
  '#FDF349',
  '#459A69',
].map((c) => Color.parse(c).rgb);

export default function initConfettiSystem(canvasEl, overrides) {
  if (!canvasEl) return () => {};

  const ctx = canvasEl.getContext('2d');
  let width, height, scale;

  const tap =
    'ontouchstart' in window || navigator.msMaxTouchPoints
      ? 'touchstart'
      : 'mousedown';

  const options = {
    particleCount: 90,
    radiusRatio: 0.008,
    animDelay: 600,
    noInteractionWait: 5000,
    velocityFactor: 0.075,
    decay: 0.94,
    gravity: 3,
    x: 0,
    y: 0,
    colors,
    ...overrides,
  };

  /**
   * Setup
   */
  function setCanvasSize() {
    const rect = canvasEl.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    scale = window.devicePixelRatio;
    canvasEl.getContext('2d').scale(scale, scale);

    width = Math.floor(w * scale);
    height = Math.floor(h * scale);
    canvasEl.width = width;
    canvasEl.height = height;
  }

  let particles = Array.from(Array(options.particleCount).keys()).map(() =>
    createParticle({ width, height }, 0, {
      ...options,
      x: 0,
      y: 0,
    })
  );

  /**
   * Init
   */
  let ANIMATION_CUED = false;
  let HUMAN = false;
  let TICK = 0;
  let timeoutID;
  let lightUpAnimation;

  setCanvasSize();
  window.addEventListener('resize', setCanvasSize, false);
  autoClick();

  /**
   * Draw
   */
  let running = true;
  animLoop(function (deltaT, now) {
    ctx.clearRect(0, 0, width, height);
    TICK++;

    const animEnded = particles.every((p) => !p.alive);

    if (animEnded && !ANIMATION_CUED && !HUMAN) {
      ANIMATION_CUED = true;

      setTimeout(() => {
        autoClick();
        ANIMATION_CUED = false;
      }, options.animDelay);
    }

    // update physics
    particles.forEach((particle) => {
      updateParticle({ width, height }, TICK, particle);
    });
    // draw
    particles.forEach((particle) => {
      drawParticle(ctx, TICK, particle);
    });

    return running;
  });

  /**
   * Events
   */
  canvasEl.addEventListener(
    tap,
    function (e) {
      HUMAN = true;
      lightUpMessage();
      TICK = 0;
      const [pointerX, pointerY] = origin(e, this.offsetLeft, this.offsetTop);
      resetParticles(
        { width, height },
        pointerX * scale,
        pointerY * scale,
        particles,
        options
      );

      if (timeoutID) {
        clearTimeout(timeoutID);
      }

      // If no interactivity for some
      // time then restart autoClick
      timeoutID = setTimeout(() => {
        HUMAN = false;
      }, options.noInteractionWait);
    },
    false
  );

  function autoClick() {
    if (HUMAN) return;
    lightUpMessage();
    TICK = 0;
    resetParticles(
      { width, height },
      Random.range(0, width),
      Random.range(0, height),
      particles,
      options
    );
  }

  /**
   * Message light-up
   */
  function lightUpMessage() {
    if (lightUpAnimation) {
      lightUpAnimation.restart();
    } else if (HUMAN) {
      setTimeout(() => {
        lightUpAnimation = anime({
          autoplay: false,
          targets: '.message, .signature',
          duration: 200,
          easing: 'easeInOutSine',
          direction: 'alternate',
          color: ['#fadc93', '#fffaed'],
        });
      }, 1000);
    }
  }

  // destroy
  return () => {
    running = false;
  };
}

/**
 * Utils
 */
function animLoop(render, element) {
  var running,
    lastFrame = +new Date();
  function loop(now) {
    // stop the loop if render returned false
    if (running !== false) {
      requestAnimationFrame(loop, element);
      running = render(now - lastFrame, now);
      lastFrame = now;
    }
  }
  loop(lastFrame);
}

function origin(e, offsetLeft, offsetTop) {
  const x = e.clientX || e.touches[0].clientX;
  const y = e.clientY || e.touches[0].clientY;
  return [x - offsetLeft, y - offsetTop];
}
