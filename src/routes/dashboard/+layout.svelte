<script lang="ts">
    import type {LayoutProps} from './$types';
    import Nav from '$lib/components/Nav.svelte';

    let {children, data}: LayoutProps = $props();
</script>

<Nav userName={data.username}/>

{@render children?.()}