<script lang="ts">
    import {Popover, Segment} from '@skeletonlabs/skeleton-svelte';
    import {Info, X} from '@lucide/svelte';
    import type {PageProps} from './$types';
    import Scanner from '$lib/components/Scanner.svelte';
    import {onMount} from 'svelte';
    import {toaster} from '$lib/toaster';
    import {normalizePrice} from '$lib/price';

    let pricingType = $state<'total' | 'item'>('total');
    let pricingHelpOpen = $state(false);

    interface Product {
        name: string;
        id: string;
        price: number;
        minPrice: number;
        quantity: number;
    }

    let products: Product[] = $state([]);

    let scanning = $state(false);

    async function onScan(code: string | null) {
        if (!code) {
            console.warn('Scanned code is null');
            return;
        }
        const response = await fetch('/api/product?' + new URLSearchParams({barcode: code}));
        if (response.ok) {
            const data = await response.json();
            // Ensure no other product with the same ID exists
            if (products.some(p => p.id === data.product.id)) {
                console.warn('Product with this ID already exists in the list');
                return;
            }
            // Add the product to the list
            products = [...products, {
                name: data.product.name,
                id: data.product.id,
                price: 0,
                minPrice: data.product.minPrice,
                quantity: 1
            }];
            scanning = false;
        } else {
            console.error('Failed to fetch product:', response.statusText);
            scanning = false;
        }
    }

    let query = $state('');

    async function search() {
        if (!query.trim()) {
            console.warn('Search query is empty');
            return;
        }
        const response = await fetch('/api/product?' + new URLSearchParams({name: query}));
        query = '';
        if (response.ok) {
            const data = await response.json();
            products = [...products, {
                name: data.product.name,
                id: data.id,
                price: 0,
                minPrice: data.product.minPrice,
                quantity: 1
            }];
        } else {
            console.error('Failed to search product:', response.statusText);
        }
    }

    let {data, form}: PageProps = $props();

    let taxIndex = $state('');

    let totalPrice = $state('');
    let totalPriceFloat = $derived(parseInt(totalPrice) || 0);

    onMount(() => {
        if (form && !form.success) {
            toaster.error({
                title: 'Error',
                description: form.message || 'An error occurred. Please try again.'
            });
        }
    });
</script>

<div class="flex flex-col items-center justify-center h-full">
    <div class="card p-4 preset-outlined-surface-500 w-full max-w-lg max-h-7/8 overflow-y-auto p-4">
        <h1 class="text-2xl font-bold mb-6 text-center">Purchase Report</h1>
        <h2 class="text-lg font-semibold">Minimum Requirements</h2>
        <ol>
            <li>Items should be no more expensive than 1.1x the local price</li>
            <li>
                Your sweat equity gain is determined by how much cheaper you can
                find the item compared to the local price
            </li>
            <li>
                You must provide a photo of the receipt or proof of purchase
            </li>
        </ol>
        <h2 class="text-lg font-semibold">Important Tax Information</h2>
        <p>
            Taxes must be accounted for within your purchase report. You are
            asked to enter an address of purchase for tax calculation. If the
            purchase was made online or there is another tax-related exemption,
            please explain in the notes section.
        </p>
        <p>
            <strong>For Total Price:</strong> Include taxes in the total price you
            enter.
        </p>
        <p>
            <strong>For Itemized Prices:</strong> Enter the price of each item without
            taxes. Taxes will be added to the total automatically.
        </p>
        <p>
            For more information on taxes, as well as a calculator, see <a
                href="/dashboard/taxes"
        >
            Taxes
        </a>
        </p>
        <form class="space-y-4" method="POST">
            <div class="flex items-center justify-between">
                <Segment
                        name="pricingType"
                        onValueChange={(e) => (pricingType = e.value)}
                        value={pricingType}
                >
                    <Segment.Item value="total">Total Price</Segment.Item>
                    <Segment.Item value="item">Itemized Prices</Segment.Item>
                </Segment>
                <Popover
                        arrow
                        arrowBackground="!bg-surface-200 dark:!bg-surface-800"
                        contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
                        onOpenChange={(e) => (pricingHelpOpen = e.open)}
                        open={pricingHelpOpen}
                        positioning={{ placement: "top" }}
                        triggerBase="btn btn-ghost btn-sm"
                >
                    {#snippet trigger()}
                        <Info/>
                    {/snippet}
                    {#snippet content()}
                        <header class="flex justify-between">
                            <p class="font-bold text-xl">Pricing Types</p>
                            <button
                                    class="btn-icon hover:preset-tonal"
                                    onclick={() => {
                                    pricingHelpOpen = false;
                                }}
                            >
                                <X/>
                            </button>
                        </header>
                        <article>
                            <p>
                                <strong class="text-semibold">
                                    Total Price:
                                </strong>
                                Enter a single price for the entire purchase.
                            </p>
                            <p>
                                <strong class="text-semibold">
                                    Itemized Prices:
                                </strong>
                                Enter the price for each item purchased.
                            </p>
                        </article>
                    {/snippet}
                </Popover>
            </div>
            {#if pricingType === "total"}
                <label class="label">
                    <span class="label-text">Total Price</span>
                    <input
                            class="input"
                            name="totalPrice"
                            placeholder="Enter total price in $"
                            required
                            type="number"
                            step="0.01"
                            bind:value={totalPrice}
                    />
                </label>
                <p class="text-sm text-gray-500 mb-4">
                    This should include sales tax.
                </p>
            {/if}
            {#each products as product, index}
                <div class="card p-4 preset-outlined-surface-500">
                    <div class="flex justify-between items-center">
                        <h2 class="text-lg font-semibold">
                            {product.name}
                        </h2>
                        <button
                                type="button"
                                class="btn-icon hover:preset-tonal"
                                onclick={() =>
                                (products = products.filter(
                                    (_, i) => i !== index,
                                ))}
                        >
                            <X/>
                        </button>
                    </div>
                    {#if pricingType === "item"}
                        <label class="label">
                            <span class="label-text">Price</span>
                            <input
                                    class="input"
                                    placeholder="Enter price in $"
                                    bind:value={product.price}
                                    required
                                    type="number"
                                    step="0.01"
                            />
                        </label>
                        <p class="text-sm text-gray-500">
                            Do not include sales tax. Enter the price of all items (this will not be multiplied by
                            quantity).
                        </p>
                    {/if}
                    <label class="label">
                        <span class="label-text">Quantity</span>
                        <input
                                class="input"
                                placeholder="Enter quantity"
                                bind:value={product.quantity}
                                required
                                type="number"
                                min="1"
                        />
                    </label>
                    {#if pricingType === "item" && (product.price / product.quantity) > product.minPrice}
                        <p class="text-sm text-red-500">
                            This product is more expensive than the minimum price. It may not be eligible for
                            reimbursement.
                        </p>
                    {/if}
                </div>
            {/each}
            <div class="card p-4 preset-outlined-surface-500">
                <h3 class="text-md">Add a product</h3>
                <label class="label">
                <span class="label-text">Search by name
                <input bind:value={query} class="input" onkeypress={()=>{
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        search();
                    }
                }} placeholder="Enter product name" type="text"
                />
                </span>
                </label>
                <button class="btn btn-primary" onclick={search} type="button">Search</button>
                <button class="btn btn-secondary" onclick={() => scanning = true} type="button">
                    Scan Barcode
                </button>
            </div>
            <input name="products" type="hidden" value={JSON.stringify(products)}/>
            <label class="label">
                <span class="label-text">City of Purchase</span>
                <select
                        bind:value={taxIndex}
                        class="select p-2"
                        name="taxRateIndex"
                >
                    <option value="">Select a city</option>
                    {#each data.taxRates as rate, index}
                        <option value={index}
                        >{rate.name} ({rate.county})
                        </option
                        >
                    {/each}
                </select>
            </label>
            {#if taxIndex}
                <p class="text-sm text-gray-500">
                    Selected tax rate: {
                    data.taxRates[parseInt(taxIndex)].percent ?? 'N/A'
                }
                </p>
                {#if pricingType === "total"}
                    {#if totalPrice && totalPriceFloat > 0}
                        <p>
                            Estimated price before taxes: ${normalizePrice(
                            totalPriceFloat / (1 + data.taxRates[parseInt(taxIndex)].taxRate)
                        )}
                        </p>
                    {/if}
                {:else}
                    {#if products.length > 0}
                        <p>
                            Estimated total price after taxes: ${normalizePrice(
                            products.reduce((sum, product) => sum + (product.price), 0) *
                            (1 + data.taxRates[parseInt(taxIndex)].taxRate)
                        )}
                        </p>
                    {/if}
                {/if}
            {/if}
            <p>
                You will be required to upload photo evidence of your purchase
                after submitting this report.
            </p>
            <button class="btn preset-filled-primary-500 w-full" type="submit">
                Submit Report
            </button>
        </form>
    </div>
</div>

<Scanner onScan={onScan} {scanning}/>
