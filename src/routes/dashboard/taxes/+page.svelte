<script lang="ts">
    import type {PageData} from './$types';

    let {data}: { data: PageData } = $props();

    let city = $state('');
    let cityInt = $derived(parseInt(city, 10) || 0);
    let selection = $derived(data.taxRates[cityInt] || {});

    const leastTaxRate = $derived(
        data.taxRates.reduce((min, rate) => (rate.taxRate < min.taxRate ? rate : min), data.taxRates[0])
    );
    const mostTaxRate = $derived(
        data.taxRates.reduce((max, rate) => (rate.taxRate > max.taxRate ? rate : max), data.taxRates[0])
    );
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <div class="card p-4 preset-outlined-surface-500 w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">
            Taxes (for Illinois Only)
        </h1>
        <h2 class="text-lg font-semibold">About</h2>
        <p class="mb-4">
            All purchases made in Illinois are subject to sales tax. The sales tax rate varies by location, as it is a
            combination of state, county, and city taxes.
        </p>
        <p class="mb-4">
            The local prices for each item are entered before taxes (that is, the price on the shelf or online).
        </p>
        <p>
            For purchase reports, either:
        </p>
        <ul class="list-disc list-inside mb-4">
            <li>Enter the total price including taxes</li>
            <li>Enter the itemized prices without taxes, and taxes will be added automatically</li>
        </ul>
        <p class="mb-4">
            Administrators are able to override tax rates in the event that they are inaccurate or not applicable.
        </p>
        <p class="mb-4">
            It is not necessary to charge sales tax to customers.
        </p>
        <h2 class="text-lg font-semibold">Calculator</h2>
        <p class="mb-4">
            This calculator only works in Illinois. For other locations, please only enter final prices including taxes.
        </p>
        <label class="label">
            <span class="label-text">City</span>
            <select bind:value={city} class="select p-2">
                <option value="">Select a city</option>
                {#each data.taxRates as rate, index}
                    <option value={index}>{rate.name} ({rate.county})</option>
                {/each}
            </select>
        </label>
        {#if city !== ''}
            <div class="mb-4">
                <p>For <strong>{selection.name}</strong> in <strong>{selection.county}</strong> county:</p>
                <p>Tax rate: <strong>{selection.percent}</strong></p>
            </div>
        {/if}
        <h2 class="text-lg mt-2 font-semibold">Extreme Taxes</h2>
        <p>
            The location with the least tax rate is <strong>{leastTaxRate.name} ({leastTaxRate.county})</strong> with a
            tax rate of <strong>{leastTaxRate.percent}</strong>.
        </p>
        {#if leastTaxRate.taxRate <= 0.0625}
            <p class="text-sm text-gray-500">
                It's likely that this is an error in the data provided by the State of Illinois, as the minimum sales
                tax anywhere in Illinois is 6.25%.
            </p>
        {/if}
        <p>
            The location with the most tax rate is <strong>{mostTaxRate.name} ({mostTaxRate.county})</strong> with a
            tax rate of <strong>{mostTaxRate.percent}</strong>.
        </p>
    </div>
</div>