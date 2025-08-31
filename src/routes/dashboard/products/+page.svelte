<script lang="ts">
	import Money from '$lib/components/Money.svelte';

	let { data } = $props();
</script>

<div class="flex h-screen w-full items-center justify-center p-8">
	<div class="w-full max-w-2/3 card preset-filled-surface-100-900 p-2">
		<div class="table-wrap">
			<table class="table caption-bottom">
				<caption class="pt-4">List of products</caption>
				<thead>
					<tr>
						<th>Name</th>
						<th>Local Price</th>
						<th>Minimum Price</th>
						<th>Maximum Price</th>
						<th>Barcodes</th>
					</tr>
				</thead>
				<tbody class="[&>tr]:hover:preset-tonal-primary">
					{#each data.products as product, index}
						<tr>
							<td>{product.name}</td>
							<td><Money amount={product.localPrice} /></td>
							<td><Money amount={product.minPrice} /></td>
							<td><Money amount={product.maxPrice} /></td>
							<td>{product.barcodes.length} barcode{product.barcodes.length !== 1 ? 's' : ''}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td colspan="4">Total</td>
						<td class="text-right">{data.products.length} Products</td>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>
