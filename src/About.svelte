<script lang="ts">
  export let onClose: () => void;

  let overlayEl: HTMLDivElement;
  function onClick(evt: MouseEvent) {
    if (evt.target === overlayEl) {
      onClose();
    }
  }
</script>

<div class="overlay" bind:this={overlayEl} on:click={onClick}>
  <div class="about">
    <button type="button" on:click={onClose}>✖</button>
    <h2>About</h2>
    <p>GDQ stats, by <a href="https://alligatr.co.uk">alligator</a>.</p>
    <p><a href="https://gdq.alligatr.co.uk/">Previous marathons and other stuff.</a></p>
    <h3>Source code</h3>
    <ul>
      <li>
        <a href="https://github.com/Alligator/agdq-tracker-uplot">This page.</a>
      </li>
      <li>
        <a href="https://github.com/Alligator/agdq-tracker">Data fetching script.</a>
      </li>
      <li>
        <a href="https://github.com/Alligator/agdq-data">Data from this and previous marathons.</a>
      </li>
    </ul>
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
    justify-content: center;
  }

  button {
    /* button overrides */
    background-color: rgba(0, 0, 0, 0);
    color: inherit;
    border: none;
    display: block;
    text-align: left;
    font-family: inherit;
    font-size: var(--text-large);
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
    width: 400px;
    background-color: var(--color-bg);
    position: absolute;
    z-index: 100;
    border-radius: 4px;
    position: relative;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: var(--text-large);
    text-align: center;
  }
  h3 {
    margin: 0;
    padding-top: var(--padding-2);
  }
</style>