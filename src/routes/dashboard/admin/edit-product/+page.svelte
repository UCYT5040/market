<script lang="ts">
    import Product from '$lib/components/forms/admin/Product.svelte';
    import Scanner from '$lib/components/Scanner.svelte'

    let product = $state(null);
    let scanning = $state(false);

    async function onScan(code: string) {
        if (!code) {
            console.warn("Scanned code is null");
            return;
        }
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

    let query = '';

    async function search() {
        if (!query.trim()) {
            console.warn("Search query is empty");
            product = null;
            return;
        }
        const response = await fetch("/api/product?" + new URLSearchParams({ name: query }));
        if (response.ok) {
            const data = await response.json();
            product = data.product;
        } else {
            console.error("Failed to search product:", response.statusText);
            product = null;
        }
    }
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <div class="card p-4 preset-outlined-surface-500 w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">
            Edit Product
        </h1>
        {#if product}
            <button class="btn btn-secondary mb-4" onclick={() => product = null}>
                Pick a different product
            </button>
            <Product {product} buttonText="Edit Product">
                <input type="hidden" name="id" value={product.id} />
            </Product>
        {:else}
            <label class="label">
                <span class="label-text">Search by name
                <input class="input" type="text" placeholder="Enter product name" bind:value={query} />
                </span>
            </label>
            <button class="btn btn-primary" onclick={search}>Search</button>
            <button class="btn btn-secondary" onclick={() => scanning = true}>
                Scan Barcode
            </button>
        {/if}
    </div>
</div>

<Scanner {scanning} onScan={onScan} />