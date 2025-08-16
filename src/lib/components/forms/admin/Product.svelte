<script lang="ts">
    import {BadgePlus, CircleDollarSign, ScanBarcode, X} from '@lucide/svelte';
    import Scanner from '$lib/components/Scanner.svelte';

    let {
        product,
        buttonText,
        children
    }: {
        product: any | null; // TODO: Define a proper type for product
        buttonText: string;
        children: any;
    } = $props();

    let barcodes: string[] = $state(product?.barcodes || []);
    let barcode = $state('');

    let scanning = $state(false);
</script>

<form class="space-y-4" method="POST">
    <label class="label">
        <span class="label-text">Name</span>
        <input class="input" maxlength="64" name="name" placeholder="Enter product name" required type="text"
               value={product?.name || ''}/>
    </label>
    <p class="text-sm opacity-60 mt-2">If multiple sizes exist, please include size in the name.</p>
    <div class="card preset-outlined-surface-500 p-4">
        <div class="flex items-center justify-center gap-4">
            <label class="label">
                <span class="label-text">Barcode</span>
                <input bind:value={barcode} class="input" placeholder="Enter product barcode"
                       type="text"/>
            </label>
            <div class="flex flex-col gap-2">
                <button class="btn-icon hover:preset-tonal" onclick={() => scanning = true}
                        type="button">
                    <ScanBarcode/>
                </button>
                <button class="btn-icon preset-filled-primary-500"
                        onclick={() => {
                                if (barcode.trim() && !barcodes.includes(barcode.trim())) {
                                    barcodes = [...barcodes, barcode.trim()];
                                    barcode = ""; // Clear input after adding
                                    console.log(barcodes);
                                }}} type="button">
                    <BadgePlus class="text-primary"/>
                </button>
            </div>
        </div>
        {#each barcodes as barcode, index}
            <div class="flex items-center justify-between">
                <span class="text-sm">{barcode}</span>
                <button type="button" class="btn-icon hover:preset-tonal"
                        onclick={() => barcodes.splice(index, 1)}>
                    <X/>
                </button>
            </div>
        {/each}
    </div>
    <input name="barcodes" type="hidden" value={barcodes.join(',')}/>
    <label class="label" for="localPrice">
        <span class="label-text">Local Price</span>
    </label>
    <div class="input-group grid-cols-[auto_1fr]">
        <div class="ig-cell preset-tonal">
            <CircleDollarSign size={16}/>
        </div>
        <input class="ig-input outline-hidden" id="localPrice" min="0" name="localPrice"
               placeholder="Local price" required step="0.0001" type="number" value={product?.localPrice || ''}
        />
    </div>
    <p class="text-sm opacity-60 mt-2">Enter the price of the item at the cheapest nearby supplier.</p>
    <p class="text-sm opacity-60">Account for bulk discounts but do not include sales or other
        discounts.</p>
    <label class="label" for="minPrice">
        <span class="label-text">Min/max price</span>
    </label>
    <div class="input-group grid-cols-[auto_1fr_auto_1fr]">
        <div class="ig-cell preset-tonal">
            <CircleDollarSign size={16}/>
        </div>
        <input class="ig-input outline-hidden" id="minPrice" min="0.01" name="minPrice"
               placeholder="Min price" required step="0.0001" type="number" value={product?.minPrice || ''}/>
        <div class="ig-cell preset-tonal">
            <CircleDollarSign size={16}/>
        </div>
        <input class="ig-input outline-hidden" id="maxPrice" min="0.01" name="maxPrice"
               placeholder="Max price" required step="0.0001" type="number" value={product?.maxPrice || ''}
        />
    </div>
    <button class="btn preset-filled-primary-500 w-full" type="submit">
        {buttonText}
    </button>
    {#if children}
        {@render children()}
    {/if}
</form>

<Scanner onScan={(code) => {
        if (code && !barcodes.includes(code)) {
            barcodes = [...barcodes, code];
        }
        scanning = false;
    }} scanning={scanning}/>