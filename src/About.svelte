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
    <p>GDQ stats, by <a href="https://alligatr.co.uk">alligator</a>. Here are some useful links:</p>
    <ul>
      <li>
        <a href="https://irc.alligatr.co.uk/agdq-comparison-uplot/">Marathon comparison chart</a>
      </li>
      <li>
        <a href="https://gdq.alligatr.co.uk/">Trackers for previous marathons</a>
      </li>
      <li>
        <a href="https://github.com/Alligator/agdq-tracker-uplot">Source code for this page</a>
      </li>
      <li>
        <a href="https://github.com/Alligator/agdq-tracker">Source code for the data fetching script</a>
      </li>
    </ul>
    <p>Special thanks to UA for giving the tracker JSON output and to the GDQ staff for keeping the schedule up to date during marathons.</p>
    <p>UI powered by <a href="https://svelte.dev/">Svelte</a> and <a href="https://leeoniya.github.io/uPlot/">uPlot</a>.</p>

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

  h2 {
    font-size: var(--text-large);
    text-align: center;
  }
  h3 {
    margin: 0;
    padding-top: var(--padding-2);
  }
</style>