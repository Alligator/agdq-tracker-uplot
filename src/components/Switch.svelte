<script lang="ts">
  export let label: string;
  export let checked: boolean;
</script>

<label>
  {label}
  <input type="checkbox" class="switch" checked={checked} on:click|stopPropagation />
</label>

<style>
  label {
    display: flex;
    align-items: center;
  }

  .switch {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 38px;
    border-radius: 11px;
    height: 21px;
    background: var(--color-switch-bg);
    position: relative;
    margin-left: var(--padding-1);
    z-index: 0;
  }

  .switch::after {
    content: '';
    display: block;
    left: 2px;
    top: 3px;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background: var(--color-switch-fg);
    transform: translate(var(--x, 0));
    transition: transform .2s;
    position: absolute;
  }

  .switch:checked {
    --x: 17px;
  }
</style>