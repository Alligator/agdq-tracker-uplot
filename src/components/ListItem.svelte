<script lang="ts">
export let active = false;
</script>

<button class="list-item" class:active type="button" on:click>
  <div class="title">
    <slot name="title"></slot>
  </div>
  <div class="subtitle">
    <slot name="subtitle"></slot>
  </div>
</button>

<style>
  .list-item {
    /* button overrides */
    background-color: inherit;
    color: inherit;
    border: none;
    display: block;
    text-align: left;
    font-family: inherit;

    padding: var(--padding-2) var(--padding-1);
    width: 100%;
    cursor: pointer;
  }
  .list-item:hover > .title,
  .list-item.active > .title {
    color: var(--color-fg-bright);
    font-weight: bold;
  }
  .list-item:hover > .title {
    font-weight: bold;
  }

  .title {
    font-size: var(--text-medium);
  }

  .subtitle {
    font-size: var(--text-small);
  }
</style>