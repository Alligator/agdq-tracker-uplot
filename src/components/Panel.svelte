<script lang="ts">
  export let title: string;
</script>

<section class="panel">
  <h2>{title}</h2>
  <div class="panel-content">
    <slot></slot>
  </div>
</section>

<style>
  h2 {
    margin: 0;
    padding: var(--padding-2);
    background-color: var(--bg-2);
    border-radius: 8px 8px 0 0;
    font-size: var(--text-small);
    text-transform: uppercase;
    text-align: center;
  }
  .panel {
    border-radius: 8px;
    background-color: var(--bg-light);
    color: var(--fg-light);
    margin-bottom: var(--padding-3);
  }
  .panel-content {
    padding: var(--padding-3);
  }
</style>