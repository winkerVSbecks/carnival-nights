import Random from 'canvas-sketch-util/random';
import { mapRange } from 'canvas-sketch-util/math';
import Color from 'canvas-sketch-util/color';
import { tween } from './tween';

/**
 * Particles
 */
export function createParticle({ width, height }, maxDist, opts) {
  const endPos = setEndLocation({ width, height }, opts.x, opts.y);
  const angle = launchAngle([opts.x, opts.y], endPos);

  const longestEdge = width > height ? width : height;

  const velocity = launchVelocity(
    maxDist,
    [opts.x, opts.y],
    endPos,
    longestEdge * opts.velocityFactor
  );

  const radius = Math.max(longestEdge * opts.radiusRatio, 6);

  return {
    alive: true,
    x: opts.x,
    y: opts.y,
    velocity,
    angle,
    colors: [Random.pick(opts.colors), Random.pick(opts.colors)],
    decay: opts.decay,
    gravity: opts.gravity,
    radius,
    random: Random.range(200, 800),
    tiltAngle: Random.range(0, Math.PI * 2),
    totalTicks: Random.rangeFloor(90, 120),
    fadeOutTicks: 20,
  };
}

export function updateParticle({ width, height }, tick, particle) {
  // Move
  particle.x += Math.cos(particle.angle) * particle.velocity;
  particle.x =
    particle.x +
    Random.noise2D(particle.x / particle.random, particle.y / particle.random);
  particle.y += Math.sin(particle.angle) * particle.velocity + particle.gravity;
  particle.velocity *= particle.decay;

  // Tilt
  particle.tiltAngle =
    particle.tiltAngle +
    Random.noise2D(
      particle.x / particle.random,
      particle.y / particle.random,
      1,
      Math.PI / 16
    );

  if (particle.y > height) {
    particle.alive = false;
  }

  if (tick > particle.totalTicks + particle.fadeOutTicks) {
    particle.alive = false;
  }
}

export function drawParticle(ctx, tick, particle) {
  const fade = tween({
    time: tick,
    duration: particle.fadeOutTicks,
    delay: particle.totalTicks,
    from: 1,
    to: 0,
    ease: 'expoOut',
  });

  const size = tween({
    time: tick,
    duration: 90,
    from: particle.radius * 1.5,
    to: particle.radius,
    ease: 'expoOut',
  });

  // shadow
  ctx.save();
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, size, 0, 2 * Math.PI, true);
  ctx.shadowColor = '#000';
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 4;
  ctx.fill();
  ctx.restore();
  // semi-circles
  particle.colors.forEach((color, idx) => {
    ctx.save();
    ctx.beginPath();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.tiltAngle);
    ctx.fillStyle = Color.style([...color, fade]);
    ctx.arc(0, 0, size, 0, Math.PI, idx === 0);
    ctx.fill();
    ctx.restore();
  });
}

export function resetParticles({ width, height }, x, y, particles, opts) {
  const maxDist = dist([0, 0], [width, height]);

  particles.forEach((particle) => {
    const endPos = setEndLocation({ width, height }, x, y);
    const angle = launchAngle([x, y], endPos);

    const longestEdge = width > height ? width : height;

    const velocity = launchVelocity(
      maxDist,
      [x, y],
      endPos,
      longestEdge * opts.velocityFactor
    );

    const radius = Math.max(longestEdge * opts.radiusRatio, 6);

    particle.alive = true;
    particle.x = x;
    particle.y = y;
    particle.velocity = velocity;
    particle.angle = angle;
    particle.colors = [Random.pick(opts.colors), Random.pick(opts.colors)];
    particle.radius = radius;
    particle.random = Random.range(200, 800);
    particle.tiltAngle = Random.range(0, Math.PI * 2);
    particle.totalTicks = Random.rangeFloor(90, 120);
  });
}

function dist([x1, y1], [x2, y2]) {
  const a = x2 - x1;
  const b = y2 - y1;

  return Math.hypot(a, b);
}

function setEndLocation({ width, height }, x, y) {
  const xBounds = [-x, width - x];
  const yBounds = [-y, height - y];

  return [x + Random.range(...xBounds), y + Random.range(...yBounds)];
}

function launchAngle([x1, y1], [x2, y2]) {
  return Math.atan2(y2 - y1, x2 - x1);
}

function launchVelocity(maxDist, startPos, endPos, startVelocity) {
  const d = dist(startPos, endPos);
  return mapRange(d, 0, maxDist, startVelocity * 0.1, 1 * startVelocity);
}
