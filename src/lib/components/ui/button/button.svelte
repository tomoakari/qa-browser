<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  type Size = 'default' | 'sm' | 'lg' | 'icon';

  type $$Props = HTMLButtonAttributes & {
    variant?: Variant;
    size?: Size;
    class?: string;
  };

  export let variant: Variant = 'default';
  export let size: Size = 'default';
  let className = '';
  export { className as class };

  // ボタンのスタイルを定義
  const getVariantClasses = (variant: Variant): string => {
    switch (variant) {
      case 'default':
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
      case 'destructive':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
      case 'outline':
        return 'border border-input bg-background hover:bg-accent hover:text-accent-foreground';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
      case 'ghost':
        return 'hover:bg-accent hover:text-accent-foreground';
      case 'link':
        return 'text-primary underline-offset-4 hover:underline';
      default:
        return '';
    }
  };

  const getSizeClasses = (size: Size): string => {
    switch (size) {
      case 'default':
        return 'h-10 px-4 py-2';
      case 'sm':
        return 'h-9 rounded-md px-3';
      case 'lg':
        return 'h-11 rounded-md px-8';
      case 'icon':
        return 'h-10 w-10';
      default:
        return '';
    }
  };

  $: buttonClasses = cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    getVariantClasses(variant),
    getSizeClasses(size),
    className
  );
</script>

<button
  class={buttonClasses}
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</button>
