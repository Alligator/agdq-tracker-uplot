<script lang="ts">
  export let onClose: () => void;
  export let title: string;
  export let big: boolean = false;

  let overlayEl: HTMLDivElement;
  function onClick(evt: MouseEvent) {
    if (evt.target === overlayEl) {
      onClose();
    }
  }
</script>

<div class="overlay" bind:this={overlayEl} on:click={onClick}>
  <div class="about {big ? 'big' : ''}">
    <header>
      <h2>{title}</h2>
      <button type="button" on:click={onClose}>✖</button>
    </header>
    <article>
      <slot name="content"></slot>
    </article>
  </div>
</div>

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99;
    background-color: var(--color-bg-faded);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button {
    margin: 0;
    background-color: rgba(0, 0, 0, 0);
  }
  button:hover {
    color: var(--color-fg-bright);
  }

  .about {
    width: 350px;
    background-color: var(--color-bg);
    z-index: 100;
    border-radius: 4px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    margin-top: 40px;
    display: flex;
    flex-direction: column;
  }
  .big {
    width: min(800px, 100vw);
    max-height: calc(90vh - 40px);
  }

  header {
    border-radius: 4px 4px 0 0;
    background-color: var(--color-bg-dimbright);
    padding: var(--padding-1) var(--padding-1) var(--padding-1) var(--padding-3);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  article {
    padding: var(--padding-2) var(--padding-3);
    overflow-y: auto;
  }

  header h2 {
    font-size: var(--text-large);
    color: var(--color-fg-subtle);
  }
  .about :global(h3) {
    font-size: var(--text-large);
  }
  .about :global(ul) {
    padding-left: 1em;
  }
</style>