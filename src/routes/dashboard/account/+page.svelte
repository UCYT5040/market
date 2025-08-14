<script lang="ts">
    import {Avatar} from '@skeletonlabs/skeleton-svelte';
    import {Camera} from '@lucide/svelte';
    import type { PageProps } from './$types';

    let {data}: PageProps = $props();
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <div class="card p-4 preset-outlined-surface-500 w-full max-w-md space-y-4 mx-4">
        <h1 class="text-2xl font-bold mb-6 text-center">
            Account Management
        </h1>
        <div class="flex justify-center items-center gap-4 preset-tonal p-4 rounded-lg">
            <Avatar name={data.userName} />
            <p class="text-xl font-semibold">
                {data.userName}
            </p>
        </div>
    </div>
</div>