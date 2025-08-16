<script lang="ts">
    import Product from '$lib/components/forms/admin/Product.svelte';
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <div class="card p-4 preset-outlined-surface-500 w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">
            New Product
        </h1>
        <Product product={null} buttonText="Add Product" />
    </div>
</div>

