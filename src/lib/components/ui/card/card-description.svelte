<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type $$Props = HTMLAttributes<HTMLParagraphElement> & {
    class?: string;
  };

  let className = '';
  export { className as class };
</script>

<p
  class={cn('text-sm text-muted-foreground', className)}
  {...$$restProps}
>
  <slot />
</p>
