<script lang="ts">
export let active = false;
export let onClick: () => void = null;

let el: HTMLElement;

$: {
  if (active && el) {
    const elTop = el.getBoundingClientRect().top;
    if (elTop < 0 || elTop > window.innerHeight) {
      el.scrollIntoView();
    }
  }
}
</script>

{#if onClick !== null}
<button class="list-item" class:active class:clickable={onClick !== null} type="button" bind:this={el} on:click={onClick}>
  <div class="title">
    <slot name="title"></slot>
  </div>
  <div class="subtitle">
    <slot name="subtitle"></slot>
  </div>
  <slot></slot>
</button>
{:else}
<div class="list-item" class:active type="button" bind:this={el}>
  <div class="title">
    <slot name="title"></slot>
  </div>
  <div class="subtitle">
    <slot name="subtitle"></slot>
  </div>
  <slot></slot>
</div>
{/if}

<style>
  .list-item {
    /* button overrides */
    background-color: inherit;
    color: inherit;
    border: none;
    display: block;
    text-align: left;
    font-family: inherit;

    padding: var(--padding-1) var(--padding-1);
    width: 100%;
    border-bottom: 1px solid var(--color-bg);

    scroll-margin-top: 45px;
    box-sizing: border-box;
  }
  .list-item.active {
    background-color: var(--color-bg);
  }
  button.list-item {
    cursor: pointer;
  }
  button.list-item:hover {
    background-color: var(--color-bg);
  }

  .list-item:hover > .title,
  .list-item.active > .title {
    color: var(--color-fg-bright);
    font-weight: bold;
  }

  .title {
    font-size: var(--text-medium);
    font-weight: bold;
  }

  .subtitle {
    font-size: var(--text-small);
  }
</style>