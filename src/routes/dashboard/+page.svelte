<script lang="ts">
	import { Tooltip } from '@skeletonlabs/skeleton-svelte';
	import type { PageProps } from './$types';
	import Money from '$lib/components/Money.svelte';
	import { valueSweat } from '$lib/valueSweat';

	let { data }: PageProps = $props();

	let sweatEquityTooltip = $state(false);
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	{#if data.admin}
		<a class="anchor text-red-500 mb-4" href="/dashboard/admin">Admin Dashboard</a>
	{/if}
	<div class="mb-8 flex w-full justify-center gap-4">
		<div class="w-full max-w-md card preset-outlined-surface-500 p-4">
			<h2 class="text-lg">Balance</h2>
			<p class="text-3xl font-semibold">
				<Money amount={data.balance} />
			</p>
			{#if data.balance < 0}
				<p class="text-error-500">
					<strong>Warning:</strong> Your balance is dangerously low!
				</p>
				<p>If your balance remains negative, you'll lose access to the platform.</p>
			{:else if data.market.balance <= 0}
				<p class="text-warning-500">
					The market balance (<Money amount={data.market.balance} />) is low! Consider <a href="/dashboard/invest" class="anchor">investing</a> to help replenish
					it.
				</p>
				<p class="text-sm">
					The market may face bankruptcy if the balance remains low.
				</p>
			{:else}
				<p>
					Consider <a href="/dashboard/invest" class="anchor">investing</a> to grow your balance and support the market.
				</p>
			{/if}
		</div>
		<div class="w-full max-w-md card preset-outlined-surface-500 p-4">
			<h2 class="text-lg">Investments</h2>
			<div class="flex gap-4">
				<div>
					<p class="text-small">Money</p>
					<p class="text-xl font-semibold"><Money amount={data.monetaryInvestment} /></p>
				</div>
				<div>
					<p class="text-small">Sweat</p>
					<p class="text-xl font-semibold">{data.sweatInvestment} unit{data.sweatInvestment !== 1 ? 's' : ''}</p>
					<Tooltip
						open={sweatEquityTooltip}
						onOpenChange={(e) => (sweatEquityTooltip = e.open)}
						positioning={{ placement: 'top' }}
						triggerBase="underline"
						contentBase="card preset-filled p-4"
						openDelay={200}
						arrow
					>
						{#snippet trigger()}(<Money amount={valueSweat(data.sweatInvestment)} />){/snippet}
						{#snippet content()}For the purpose of ownership calculation, sweat equity is multiplied
							by the federal minimum wage to determine it's value.{/snippet}
					</Tooltip>
				</div>
				<div>
					<p class="text-small">Ownership</p>
					<p class="text-xl font-semibold">
						{data.ownership * 100}%
					</p>
				</div>
			</div>
		</div>
		<div class="w-full max-w-md card preset-outlined-surface-500 p-4">
			<h2 class="text-lg">Performance</h2>
			<p class="text-3xl font-semibold">5 sales</p>
			<p class="text-small">Top 10% of all members</p>
		</div>
	</div>
</div>
