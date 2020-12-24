<script>
  import { onMount, onDestroy } from 'svelte';
  import initConfettiSystem from './confetti-system';

  let canvasEl, destroyAnimLoop;

  export let particleCount = 90;
  export let radiusRatio = 8;
  export let velocityFactor = 75;
  export let decay = 0.94;
  export let gravity = 3;

  onMount(() => {
    setTimeout(() => {
      destroyAnimLoop = initConfettiSystem(canvasEl, {
        particleCount,
        radiusRatio: radiusRatio / 1000,
        velocityFactor: velocityFactor / 1000,
        decay,
        gravity,
      });
    }, 1000);
  });

  onDestroy(() => {
    if (destroyAnimLoop) {
      destroyAnimLoop();
    }
  });
</script>

<canvas class="carnival-nights" bind:this="{canvasEl}"></canvas>

<style>
  canvas {
    display: block;
    background-color: #000;
    background-size: 200px;
    cursor: cell;
    width: 100vw;
    height: 100vh;
  }
</style>
