<script lang="ts">
	import { Popover, Segment } from '@skeletonlabs/skeleton-svelte';
	import { Info, X } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Scanner from '$lib/components/Scanner.svelte';
	import { onMount } from 'svelte';
	import { toaster } from '$lib/toaster';
	import { normalizePrice } from '$lib/price';

	/*
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
		const response = await fetch('/api/product?' + new URLSearchParams({ barcode: code }));
		if (response.ok) {
			const data = await response.json();
			// Ensure no other product with the same ID exists
			if (products.some((p) => p.id === data.product.id)) {
				console.warn('Product with this ID already exists in the list');
				return;
			}
			// Add the product to the list
			products = [
				...products,
				{
					name: data.product.name,
					id: data.product.$id,
					price: 0,
					minPrice: data.product.minPrice,
					quantity: 1
				}
			];
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
		const response = await fetch('/api/product?' + new URLSearchParams({ name: query }));
		query = '';
		if (response.ok) {
			const data = await response.json();
			products = [
				...products,
				{
					name: data.product.name,
					id: data.product.$id,
					price: 0,
					minPrice: data.product.minPrice,
					quantity: 1
				}
			];
		} else {
			console.error('Failed to search product:', response.statusText);
		}
	}

	let { data, form }: PageProps = $props();

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
	*/
</script>

<div class="flex h-full flex-col items-center justify-center">
	<div class="max-h-7/8 w-full max-w-lg overflow-y-auto card preset-outlined-surface-500 p-4">
		<h1 class="mb-6 text-center text-2xl font-bold">Self Sale</h1>
		<p>
			Self sales are not implemented yet.
		</p>
		<p>
			For now, please report any self sales to the administrator, where they can then adjust your balance accordingly.
		</p>
	</div>
</div>

<Scanner {onScan} {scanning} />
