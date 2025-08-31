<script lang="ts">
	import { AppBar, Avatar } from '@skeletonlabs/skeleton-svelte';
	import { Apple, BadgeDollarSign, LayoutDashboard, Receipt, ScanBarcode } from '@lucide/svelte';

	const {
		userName
	}: {
		userName: string;
	} = $props();
</script>

<AppBar>
	{#snippet lead()}
		<a href="/dashboard" class="flex items-center gap-2">
			<LayoutDashboard />
			Dashboard
		</a>
		<a href="/dashboard/new-sale" class="flex items-center gap-2">
			<BadgeDollarSign />
			New Sale
		</a>
		<a href="/dashboard/purchase-reports" class="flex items-center gap-2">
			<Receipt />
			Purchase Reports
		</a>
		<a href="/dashboard/products" class="flex items-center gap-2">
			<Apple />
			Products
		</a>
		<a href="/dashboard/scanner" class="flex items-center gap-2">
			<ScanBarcode />
			Scanner
		</a>
	{/snippet}
	{#snippet trail()}
		<a class="flex items-center gap-4" href="/dashboard/account">
			<Avatar name={userName} size="size-12" />
			<span class="font-semibold">{userName}</span>
		</a>
	{/snippet}
</AppBar>
