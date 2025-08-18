<script lang="ts">
	import { form } from '$app/server';
	import { normalizePrice } from '$lib/price';

	let {
		amount
	}: {
		amount: number;
	} = $props();

	let normalAmount = $derived(normalizePrice(amount));

	let formattedAmount = $derived.by(() => {
		if (normalAmount < 0) {
			// Show - before $
			return `-$${Math.abs(normalAmount)}`;
		}
		return `$${normalAmount}`;
	});
</script>

{#if normalAmount < 0}
	<span class="text-error-500">
		{formattedAmount}
	</span>
{:else}
	{formattedAmount}
{/if}
