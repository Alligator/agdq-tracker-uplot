<section>
  <div class="aside">
    <slot name="aside"></slot>
  </div>
  <div class="content">
    <slot name="content"></slot>
  </div>
</section>

<style>
  section {
    display: flex;
    min-height: 0;
  }

  .aside {
    overflow-y: auto;
    max-width: 40ex;
    background-color: var(--color-bg-dim);
    /* border: 1px solid white; */
  }

  .content {
    flex-grow: 1;
    overflow: hidden;
  }
</style>