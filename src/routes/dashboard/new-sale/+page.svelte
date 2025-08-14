<script lang="ts">
    import {Segment, Popover} from '@skeletonlabs/skeleton-svelte';
    import {Info, X, BadgePlus} from '@lucide/svelte';

    let pricingType = $state<'total' | 'item'>('total');
    let pricingHelpOpen = $state(false);

    interface Product {
        name: string;
        barcode: string;
        price: number;
        quantity: number;
    }

    function product() {
        return {
            name: '',
            barcode: '',
            price: 0,
            quantity: 1
        } as Product;
    }

    let products: Product[] = $state([product()]);
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <div class="card p-4 preset-outlined-surface-500 w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">
            New Sales
        </h1>
        <form class="space-y-4" method="POST">
            <label class="label">
                <span class="label-text">Customer Name</span>
                <input class="input" name="customerName" placeholder="Enter customer's name" required type="text"/>
            </label>
            <p class="text-sm opacity-60 mt-2">Please enter "Unknown" if you are unsure of the customer's name.</p>
            <div class="flex items-center justify-between">
                <Segment name="pricingType" onValueChange={(e) => (pricingType = e.value)} value={pricingType}>
                    <Segment.Item value="total">
                        Total Price
                    </Segment.Item>
                    <Segment.Item value="item">
                        Itemized Prices
                    </Segment.Item>
                </Segment>
                <Popover arrow arrowBackground="!bg-surface-200 dark:!bg-surface-800"
                         contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
                         onOpenChange={(e) => pricingHelpOpen = e.open}
                         open={pricingHelpOpen}
                         positioning={{placement: 'top'}}
                         triggerBase="btn btn-ghost btn-sm">
                    {#snippet trigger()}
                        <Info/>
                    {/snippet}
                    {#snippet content()}
                        <header class="flex justify-between">
                            <p class="font-bold text-xl">Pricing Types</p>
                            <button class="btn-icon hover:preset-tonal" onclick={()=>{pricingHelpOpen = false}}>
                                <X/>
                            </button>
                        </header>
                        <article>
                            <p>
                                <strong class="text-semibold">
                                    Total Price:
                                </strong>
                                Enter a single price for the entire sale. For analytical purposes, each item's price
                                will be calculated based on it's local price.
                            </p>
                            <p>
                                <strong class="text-semibold">
                                    Itemized Prices:
                                </strong>
                                Enter the price for each item sold. This will allow for more detailed analytics and
                                tracking of individual item sales.
                            </p>
                        </article>
                    {/snippet}
                </Popover>
            </div>
            {#if pricingType === 'total'}
                <label class="label">
                    <span class="label-text">Total Price</span>
                    <input class="input" name="totalPrice" placeholder="Enter total price in $" required type="number"
                           step="0.01"/>
                </label>
            {/if}
            {#each products as product, index}
                <div class="card p-4 preset-outlined-surface-500">
                    <div class="flex justify-between items-center">
                        <h2 class="text-lg font-semibold">Product {index + 1}</h2>
                        <button type="button" class="btn-icon hover:preset-tonal"
                                onclick={() => products = products.filter((_, i) => i !== index)}>
                            <X/>
                        </button>
                    </div>
                    <label class="label">
                        <span class="label-text">Product Name</span>
                        <input class="input" name={`products[${index}].name`} placeholder="Enter product name"
                               bind:value={product.name} required type="text"/>
                    </label>
                    <label class="label">
                        <span class="label-text">Barcode</span>
                        <input class="input" name={`products[${index}].barcode`} placeholder="Enter barcode"
                               bind:value={product.barcode} required type="text"/>
                    </label>
                    {#if pricingType === 'item'}
                        <label class="label">
                            <span class="label-text">Price</span>
                            <input class="input" name={`products[${index}].price`} placeholder="Enter price in $"
                                   bind:value={product.price} required type="number" step="0.01"/>
                        </label>
                    {/if}
                    <label class="label">
                        <span class="label-text">Quantity</span>
                        <input class="input" name={`products[${index}].quantity`} placeholder="Enter quantity"
                               bind:value={product.quantity} required type="number" min="1"/>
                    </label>
                </div>
            {/each}
            <button type="button" class="btn preset-filled-secondary-500 w-full flex items-center justify-center gap-4"
                    onclick={() => products = [...products, product()]}>
                <BadgePlus class="mr-2"/> Add Another Product
            </button>
            <input type="hidden" name="productCount" value={products.length}/>
            <button class="btn preset-filled-primary-500 w-full" type="submit">
                Submit Sale
            </button>
        </form>
    </div>
</div>