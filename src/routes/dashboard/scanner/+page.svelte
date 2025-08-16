<script lang="ts">
    import Scanner from '$lib/components/Scanner.svelte';

    let product = $state(null);
    let scanning = $state(false);

    async function onScan(code: string) {
        const response = await fetch("/api/product?" + new URLSearchParams({ barcode: code }));
        if (response.ok) {
            const data = await response.json();
            product = data.product;
            scanning = false;
        } else {
            console.error("Failed to fetch product:", response.statusText);
            product = null;
            scanning = false;
        }
    }
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <div class="card p-4 preset-outlined-surface-500 w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">
            Scanner
        </h1>
        {#if product}
            <p class="mb-4">Scanned Product: {product.name}</p>
        {:else}
            <p class="mb-4">Scan a product to get started.</p>
        {/if}
        <button class="btn btn-primary" onclick={() => scanning = true}>
            Scan Product
        </button>
    </div>
</div>

<Scanner scanning={scanning} onScan={onScan}></Scanner>