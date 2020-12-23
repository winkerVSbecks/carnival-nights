<script>
  import { onMount } from 'svelte';
  import initConfettiSystem from './confetti-system';

  let canvasEl;

  onMount(() => {
    setTimeout(() => {
      initConfettiSystem(canvasEl);
    }, 1000);
  });
</script>

<canvas class="carnival-nights" bind:this="{canvasEl}"></canvas>

<style>
  canvas {
    display: block;
    background-color: #000;
    background-size: 200px;
    cursor: cell;
  }
</style>
