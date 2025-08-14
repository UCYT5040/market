<script lang="ts">
    import {AppBar, Avatar} from '@skeletonlabs/skeleton-svelte';
    import { BadgeDollarSign } from '@lucide/svelte';

    const { userName }: {
        userName: string;
    } = $props();


</script>

<AppBar>
    {#snippet lead()}
        <a href="/dashboard/new-sale" class="flex items-center gap-2">
            <BadgeDollarSign />
            New Sale
        </a>
    {/snippet}
    {#snippet trail()}
        <a class="flex items-center gap-4" href="/dashboard/account">
            <Avatar name={userName} size="size-12" />
            <span class="font-semibold">{userName}</span>
        </a>
    {/snippet}
    <span>Market</span>
</AppBar>