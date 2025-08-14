<script lang="ts">
    import {BadgePlus, CircleDollarSign, ScanBarcode, X} from '@lucide/svelte';
    import Scanner from '$lib/components/Scanner.svelte';

    let barcodes: string[] = $state([]);
    let barcode = $state('');

    let scanning = $state(false);
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <div class="card p-4 preset-outlined-surface-500 w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">
            New Product
        </h1>
        <form class="space-y-4" method="POST">
            <label class="label">
                <span class="label-text">Name</span>
                <input class="input" name="name" placeholder="Enter product name" required type="text" maxlength="64"/>
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
            <input type="hidden" name="barcodes" value={barcodes.join(',')}/>
            <label class="label" for="localPrice">
                <span class="label-text">Local Price</span>
            </label>
            <div class="input-group grid-cols-[auto_1fr]">
                <div class="ig-cell preset-tonal">
                    <CircleDollarSign size={16}/>
                </div>
                <input class="ig-input outline-hidden" id="localPrice" name="localPrice" placeholder="Local price"
                       type="number"/>
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
                <input class="ig-input outline-hidden" id="minPrice" name="minPrice" placeholder="Min price"
                       type="number"/>
                <div class="ig-cell preset-tonal">
                    <CircleDollarSign size={16}/>
                </div>
                <input class="ig-input outline-hidden" id="maxPrice" name="maxPrice" placeholder="Max price"
                       type="number"/>
            </div>
            <button class="btn preset-filled-primary-500 w-full" type="submit">
                Add Product
            </button>
        </form>
    </div>
</div>

<Scanner onScan={(code) => {
        if (code && !barcodes.includes(code)) {
            barcodes = [...barcodes, code];
        }
        scanning = false;
    }} scanning={scanning}/>