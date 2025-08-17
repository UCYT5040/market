<script lang="ts">
    import {Modal} from '@skeletonlabs/skeleton-svelte';
    import type {PreviewImage} from '$lib/previewImage';

    let { image, alt }: {
        image: PreviewImage,
        alt: string
    } = $props();

    let open = $state(false);
    let loading = $state(true);
</script>

<Modal
        open={open}
        onOpenChange={(event) => (open = event.open)}
        triggerBase=""
        contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
        backdropClasses="backdrop-blur-sm"
>
    {#snippet trigger()}
        <img src={image.previewURL} alt={alt} />
    {/snippet}
    {#snippet content()}
        <img src={image.imageURL} alt={alt} class="max-w-full h-auto" onload={() => (loading = false)} />
        {#if loading}
            <div class="text-center text-gray-500">Loading...</div>
        {/if}
    {/snippet}
</Modal>
