<script lang="ts">
    import '../app.css';
    import favicon from '$lib/assets/favicon.svg';
    import type {LayoutProps} from './$types';
    import { Toaster } from '@skeletonlabs/skeleton-svelte';
    import {toaster} from '$lib/toaster';

    let {children}: LayoutProps = $props();
</script>

<svelte:head>
    <link href={favicon} rel="icon"/>
</svelte:head>

<Toaster {toaster}></Toaster>

{@render children?.()}
