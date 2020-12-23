<script>
  import { fade } from 'svelte/transition';
  import { from } from './message.store';
  import Signature from './Signature.svelte';
  export let visible = false;
</script>

<svelte:head>
  <title>Season’s greetings from {$from}</title>
  <meta name="description" content="From {$from}" />
</svelte:head>

{#if visible}
<section transition:fade="{{ delay: 200 }}" class="message">
  <h1 class="headline">Season&rsquo;s Greetings</h1>
  <p class="from">from</p>
  <p class="name">{$from}</p>
</section>
{:else}
<section class="message">
  <div class="interaction-indicator">tap</div>
</section>
{/if}

<style>
  .message {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;

    pointer-events: none;
    user-select: none;

    padding: 0 2rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    color: #ffdc88;
  }

  .headline {
    font-size: 36px;
    font-weight: 400;
    line-height: 38px;
    margin: 0;
    text-align: center;
    font-weight: normal;
  }

  .from {
    font-size: 14px;
    line-height: 1;
    margin: 8px 0 0;
    text-align: center;
    font-weight: normal;
  }

  .name {
    font-family: 'Patrick Hand', cursive;
    font-size: 60px;
    line-height: 1;
    margin: 8px 0 0;
    text-align: center;
    font-weight: normal;
    text-transform: capitalize;
  }

  @media screen and (min-width: 768px) {
    .headline {
      font-size: 53px;
      line-height: 55px;
    }

    .from {
      font-size: 24px;
    }

    .name {
      font-size: 90px;
    }
  }

  .interaction-indicator {
    color: #ffdc88;
    font-weight: normal;
    font-size: 16px;
    line-height: 21px;
    text-align: center;
    border: 2px solid #ffdc88;
    border-radius: 100%;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 4s cubic-bezier(0.37, 0, 0.63, 1) infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 0.6;
      transform: scale(0.95);
    }

    70% {
      opacity: 1;
      transform: scale(1);
    }

    100% {
      opacity: 0.6;
      transform: scale(0.95);
    }
  }
</style>
