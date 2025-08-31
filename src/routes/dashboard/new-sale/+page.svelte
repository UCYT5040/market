<script lang="ts">
	import { Segment, Popover } from '@skeletonlabs/skeleton-svelte';
	import { Info, X, UserSearch } from '@lucide/svelte';
	import Money from '$lib/components/Money.svelte';
	import Scanner from '$lib/components/Scanner.svelte';
	import type { PageProps } from './$types';
	import { round } from '$lib/round';

	let {data}: PageProps = $props();

	let pricingType: "total" | "item" = $state('total');
	let pricingHelpOpen = $state(false);

	interface Product {
		name: string;
		id: string;
		price: number;
		minPrice?: number;
		localPrice: number;
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
					localPrice: data.product.localPrice,
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
			// Ensure no other product with the same ID exists
			if (products.some((p) => p.id === data.product.id)) {
				console.warn('Product with this ID already exists in the list');
				return;
			}
			products = [
				...products,
				{
					name: data.product.name,
					id: data.product.$id,
					price: 0,
					minPrice: data.product.minPrice,
					localPrice: data.product.localPrice,
					quantity: 1
				}
			];
		} else {
			console.error('Failed to search product:', response.statusText);
		}
	}

	let totalValue: string = $state('');

	let customerPaidValue: string = $state('');

	let total = $derived.by(() => {
		if (pricingType === 'total') {
			return parseFloat(totalValue) || 0;
		} else {
			return products.reduce((sum, product) => sum + product.price, 0);
		}
	})

	// Profit (before commission) (total - sum of localPrice * quantity)
	let baseProfit = $derived(
		round(total - products.reduce((sum, product) => sum + product.localPrice * product.quantity, 0))
	);

	let commissionProfit = $derived(
		round(baseProfit * data.commissionRate)
	);

	let companyProfit = $derived(
		round(baseProfit - commissionProfit)
	);

	let shareholderProfit = $derived(
		round(companyProfit * data.ownership)
	);

	let customerTransaction = $derived(
		round((parseFloat(customerPaidValue) || 0) - total)
	);

	interface Customer {
		name: string;
		balance: number;
		$id: string;
	}

	let customerSearchQuery = $state('');
	let customerSearchResults: Customer[] = $state([]);
	let searchedCustomers = $state(false);

	async function searchCustomers(query: string) {
		if (!query) {
			customerSearchResults = [];
			return;
		}
		const url = '/api/customer?' + new URLSearchParams({ name: query });
		const response = await fetch(url);
		if (response.ok) {
			customerSearchResults = (await response.json()).customers;
		} else {
			console.error('Failed to fetch customers:', response.statusText);
		}
		searchedCustomers = true;
	}

	async function createCustomer(name: string) {
		const url = '/api/customer';
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name })
		});
		if (response.ok) {
			const newCustomer = await response.json();
			selectedCustomer = newCustomer.customer;
			if (!selectedCustomer) {
				console.error('Created customer is null');
				return;
			}
			customerSearchQuery = selectedCustomer.name;
			customerSearchResults = [selectedCustomer];
		} else {
			console.error('Failed to create customer:', response.statusText);
		}
	}

	let selectedCustomer: Customer | null = $state(null);

	let customerBalance = $derived(
		round((selectedCustomer ? selectedCustomer.balance : 0) + customerTransaction)
	);

</script>

<div class="flex h-screen flex-col items-center justify-center">
	<div class="w-full max-w-md card preset-outlined-surface-500 p-4 overflow-y-scroll">
		<h1 class="mb-6 text-center text-2xl font-bold">New Sale</h1>
		<form class="space-y-4" method="POST">
			{#if selectedCustomer}
				<p>
					Selected Customer: {selectedCustomer.name} (<Money amount={selectedCustomer.balance} />)
				</p>
			{:else if searchedCustomers}
				{#if customerSearchResults.length > 0}
					<ul class="mt-2">
						{#each customerSearchResults as customer}
							<li class="flex items-center justify-between">
								<span>{customer.name} (<Money amount={customer.balance} />)</span>
								<button
									type="button"
									class="btn-primary btn btn-sm"
									onclick={() => {
										selectedCustomer = customer;
										customerSearchQuery = customer.name;
									}}
								>
									Select
								</button>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-2">No customers found.</p>
					<button
						type="button"
						class="btn preset-filled-secondary-500"
						onclick={() => createCustomer(customerSearchQuery)}
					>
						Create New Customer
					</button>
					<p class="text-sm">Please make sure you typed the customer's name correctly.</p>
				{/if}
			{:else}
			<div class="flex items-center gap-2">
				<label class="label">
					<span class="label-text">Customer Name</span>
					<input
						class="input"
						placeholder="Enter customer's name"
						required
						type="text"
						bind:value={customerSearchQuery}
					/>
				</label>
				<button
					type="button"
					class="btn preset-filled-primary-500"
					onclick={() => searchCustomers(customerSearchQuery)}
				>
					<UserSearch />
				</button>
			</div>
			<p class="text-xs">
						Other users of the market should not be considered customers.<br />
						Users who wish to consume products should submit a
						<a class="anchor" href="/dashboard/self-sale">Self-Sale</a>.<br />
						You cannot earn a commission on sales made to yourself or other users.
			</p>
			{/if}
			<label class="label">
				<span class="label-text">Customer Paid</span>
				<input
					class="input"
					name="customerPaid"
					placeholder="Enter amount paid in $"
					required
					type="number"
					bind:value={customerPaidValue}
				/>
				<span class="text-sm"> Any debt/change will be applied to the customer's balance.</span>
			</label>
			<!-- TODO: Show warning if customer has a lot of debt -->
			<div class="flex items-center justify-between">
				<Segment
					name="pricingType"
					onValueChange={(e) => (pricingType = e.value as 'total' | 'item')}
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
					positioning={{ placement: 'top' }}
					triggerBase="btn btn-ghost btn-sm"
				>
					{#snippet trigger()}
						<Info />
					{/snippet}
					{#snippet content()}
						<header class="flex justify-between">
							<p class="text-xl font-bold">Pricing Types</p>
							<button
								class="btn-icon hover:preset-tonal"
								onclick={() => {
									pricingHelpOpen = false;
								}}
							>
								<X />
							</button>
						</header>
						<article>
							<p>
								<strong class="text-semibold">Total Price: </strong>
								Enter a single price for the entire sale. For analytical purposes, each item's price
								will be calculated based on it's local price.
							</p>
							<p>
								<strong class="text-semibold">Itemized Prices: </strong>
								Enter the price for each item sold. This will allow for more detailed analytics and tracking
								of individual item sales.
							</p>
						</article>
					{/snippet}
				</Popover>
			</div>
			{#if pricingType === 'total'}
				<label class="label">
					<span class="label-text">Total Price</span>
					<input
						class="input"
						name="totalPrice"
						placeholder="Enter total price in $"
						required
						type="number"
						step="0.01"
						bind:value={totalValue}
					/>
				</label>
			{/if}
			{#each products as product, index}
				<div class="card preset-outlined-surface-500 p-4">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold">{product.name}</h2>
						<button
							type="button"
							class="btn-icon hover:preset-tonal"
							onclick={() => (products = products.filter((_, i) => i !== index))}
						>
							<X />
						</button>
					</div>
					{#if pricingType === 'item'}
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
					{#if pricingType == "item"}
						<p>
							<strong>Price per item:</strong>
							{round(product.price / product.quantity)}
						</p>
						<p>
							<small>Price is not multiplied by quantity. Be sure to increase price when you increase the quantity.</small>
						</p>	
					{/if}
				</div>
			{/each}
			<div class="card preset-outlined-surface-500 p-4">
				<h3 class="text-md">Add a product</h3>
				<label class="label">
					<span class="label-text">Search by name</span>
					<input
						bind:value={query}
						class="input"
						onkeypress={(event) => {
							if (event.key === 'Enter') {
								event.preventDefault();
								search();
							}
						}}
						placeholder="Enter product name"
						type="text"
					/>
				</label>
				<button class="btn-primary btn" onclick={search} type="button">Search</button>
				<button class="btn-secondary btn" onclick={() => (scanning = true)} type="button">
					Scan Barcode
				</button>
			</div>
			<input name="pricingType" type="hidden" value={pricingType} />
			<input name="products" type="hidden" value={JSON.stringify(products)} />
			<input name="customerId" type="hidden" value={selectedCustomer?.$id || ''} />
			<p>
				<strong>Order total:</strong> <Money amount={total} />
			</p>
			<p>
				<strong>Base profit:</strong> <Money amount={baseProfit} />
			</p>
			<p>
				<strong>Your commission rate:</strong> {data.commissionRate * 100}%
				<br />
				<strong>Your commission profit:</strong> <Money amount={commissionProfit} />
			</p>
			<p>
				<strong>Company profit:</strong> <Money amount={companyProfit} />
			</p>
			<p>
				<strong>Your ownership:</strong> {data.ownership * 100}%<br>
				<strong>Profit from ownership:</strong> <Money amount={shareholderProfit} />
			</p>
			<p>
				<strong>Your total profit:</strong> <Money amount={commissionProfit + shareholderProfit} />
			</p>
			<p>
				<strong>Customer paid:</strong> <Money amount={parseFloat(customerPaidValue) || 0} />
				<br />
				<strong>Customer amount due (for this transaction):</strong> <Money amount={customerTransaction} />
				<br />
				<span class="text-sm text-gray-500">
					If a customer requests change in cash, please adjust the "Customer Paid" field accordingly. Otherwise, their balance will be updated automatically and they can use it for future purchases.
				</span>
				<br />
				<strong>Customer balance (after transaction):</strong> <Money amount={customerBalance} />
			</p>
			{#if !selectedCustomer}
				<p class="text-sm text-red-500">Please select a customer before submitting.</p>
			{/if}
			{#if products.length === 0}
				<p class="text-sm text-red-500">Please add at least one product before submitting.</p>
			{/if}
			<button
				class="btn w-full preset-filled-primary-500"
				type="submit"
				disabled={!selectedCustomer || products.length === 0}
			>
				Submit Sale
			</button>
		</form>
	</div>
</div>

<Scanner {onScan} {scanning} />
