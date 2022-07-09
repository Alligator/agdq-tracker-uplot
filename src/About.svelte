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
    <button type="button" on:click={onClose}>✖</button>
    <h2>{title}</h2>
    <slot name="content"></slot>
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
    /* button overrides */
    background-color: rgba(0, 0, 0, 0);
    color: inherit;
    border: none;
    display: block;
    text-align: left;
    font-family: inherit;
    font-size: 16pt;
    position: absolute;
    right: 0;
    top: 0;
    margin-right: 5px;
    margin-top: 5px;
    cursor: pointer;
  }
  button:hover {
    color: var(--color-fg-bright);
  }

  .about {
    padding: var(--padding-3);
    width: 350px;
    background-color: var(--color-bg);
    position: absolute;
    z-index: 100;
    border-radius: 4px;
    position: relative;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    margin-top: 40px;
  }
  .big {
    width: 700px;
  }

  h2 {
    font-size: var(--text-large);
    text-align: center;
  }
</style>