<script lang="ts">
  export let title: string = '';
</script>

<section class="panel">
  <slot />
  <!-- <h2>{title}</h2>
  <div class="panel-content">
    <slot />
  </div> -->
</section>

<style>
  h2 {
    margin: 0;
    padding: var(--padding-2);
    text-align: center;
  }
  .panel {
    border-radius: 4px;
    background-color: var(--bg-light);
    color: var(--fg-light);
    margin-bottom: var(--padding-3);
  }
  .panel-content {
    padding: var(--padding-3);
  }
</style>
