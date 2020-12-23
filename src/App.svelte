<script>
  import Canvas from './Canvas.svelte';
  import Message from './Message.svelte';
  import Attribution from './Attribution.svelte';

  let messageVisible = false;

  function showMessage() {
    messageVisible = true;
  }
</script>

<main on:click={showMessage}>
  <Canvas />
  <Message visible={messageVisible} />
</main>

<Attribution />