<script lang="ts">
    import '../app.css';
    import type {LayoutProps} from './$types';
    import { Toaster } from '@skeletonlabs/skeleton-svelte';
    import {toaster} from '$lib/toaster';

    let {children}: LayoutProps = $props();
</script>

<Toaster {toaster}></Toaster>

{@render children?.()}
