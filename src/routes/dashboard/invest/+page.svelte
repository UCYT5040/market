<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';
	import { ArrowRight, ChartLine, Info, Pickaxe, Skull, WalletCards } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	let value = $state(['overview']);
	let autoInvestPercent = $state(
		data.autoInvestDividendPercent * 100
	);
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<div class="w-full max-w-1/2 card preset-outlined-surface-500 p-4">
		<h1 class="mb-6 text-center text-2xl font-bold">Invest</h1>
		<form class="mb-2 flex items-center gap-2" action="?/invest" method="POST">
			<label class="label">
				<span class="label-text">Investment Amount</span>
				<!-- TODO: Use input group w/ $ icon -->
				<input
					type="number"
					class="input"
					min="0"
					step="0.0001"
					placeholder="Enter amount"
					name="amount"
				/>
			</label>
			<button type="submit" class="btn preset-filled-primary-500">Invest</button>
		</form>
		{#if data.showMidnightWarning}
			<p class="mb-2 text-error-500">
				<strong>Warning:</strong>
				It is close to midnight on the server (within 15 minutes).<br />
				If you place an order now, it is unclear as to whether it will be processed today, or if it will
				be delayed until tomorrow.
			</p>
		{/if}
		<hr class="mb-2 hr" />
		<form class="mb-2 flex items-center gap-2" action="?/setAutoInvest" method="POST">
			<!-- TODO: Figure out why Tailwind's w-32 class wont work here. -->
			<span class="text-right text-lg font-semibold" style="width: 8rem;">
				{autoInvestPercent}%
			</span>
			<label class="label">
				<span class="label-text">Dividend Auto Invest Percent</span>
				<input
					type="range"
					class="input"
					min="0"
					max="100"
					step="0.1"
					bind:value={autoInvestPercent}
					name="percent"
				/>
				<span class="text-xs text-gray-500"> Tip: Use the arrow keys for precise adjustments </span>
			</label>
			<button type="submit" class="btn preset-filled-primary-500">Save</button>
		</form>
		<h2 class="text-xl">Info</h2>
		<Accordion {value} onValueChange={(e) => (value = e.value)}>
			<Accordion.Item value="overview">
				{#snippet lead()}<Info size={24} />{/snippet}
				{#snippet control()}Overview{/snippet}
				{#snippet panel()}
					<div class="space-y-4">
						<div class="card preset-filled-primary-500 p-4">
							<h3 class="mb-2 text-lg font-bold">Simple Investment Process</h3>
							<div class="flex items-center justify-center text-xl font-semibold">
								<span class="badge preset-filled-secondary-500 px-3 py-1">Invest</span>
								<ArrowRight size={32} class="mx-2" />
								<span class="badge preset-filled-success-500 px-3 py-1">Make Money</span>
							</div>
						</div>
						<p class="text-sm opacity-75">
							Participate in market profits through simple investments and earn daily dividends
							based on your ownership share.
						</p>
					</div>
				{/snippet}
			</Accordion.Item>
			<hr class="hr" />
			<Accordion.Item value="profitsDividends">
				{#snippet lead()}<ChartLine size={24} />{/snippet}
				{#snippet control()}Profits & Dividends{/snippet}
				{#snippet panel()}
					<div class="space-y-4">
						<div class="card preset-filled-success-500 p-3">
							<h3 class="mb-2 text-lg font-bold">Profit Distribution</h3>
							<div class="text-center text-2xl font-bold">
								100% of profits are issued as dividends
							</div>
							<p class="mt-1 text-center text-sm opacity-75">The market retains no profits</p>
						</div>

						<div>
							<h4 class="mb-2 font-semibold">How Your Share is Calculated:</h4>
							<div class="space-y-2 card preset-outlined-surface-500 p-3">
								<div class="text-sm">
									<span class="badge preset-filled-primary-500 text-xs">Personal Investment</span> =
									<code class="code text-xs">
										Monetary Investments + (Federal Minimum Wage × Sweat Equity)
									</code>
								</div>
								<div class="text-sm">
									<span class="badge preset-filled-secondary-500 text-xs">Your Share</span> =
									<code class="code text-xs"> Personal Investment ÷ Everyone's Investment </code>
								</div>
							</div>
						</div>

						<div class="card preset-outlined-primary-500 p-3">
							<h4 class="mb-1 font-semibold">Dividend Schedule</h4>
							<ul class="space-y-1 text-sm">
								<li>• <strong>When:</strong> Daily at midnight</li>
								<li>• <strong>Condition:</strong> Only if profits were made that day</li>
								<li>• <strong>Amount:</strong> Based on your ownership percentage</li>
							</ul>
						</div>
					</div>
				{/snippet}
			</Accordion.Item>
			<hr class="hr" />
			<Accordion.Item value="investing">
				{#snippet lead()}<WalletCards size={24} />{/snippet}
				{#snippet control()}Investing{/snippet}
				{#snippet panel()}
					<div class="space-y-4">
						<div>
							<h4 class="mb-2 font-semibold">Investment Process</h4>
							<div class="card preset-outlined-primary-500 p-3">
								<ul class="space-y-2 text-sm">
									<li class="flex items-start">
										<span class="mt-2 mr-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500"
										></span>
										<span><strong>When:</strong> Anytime you have funds in your account</span>
									</li>
									<li class="flex items-start">
										<span class="mt-2 mr-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500"
										></span>
										<span
											><strong>Processing:</strong> After dividend issue (or at midnight if no dividends)</span
										>
									</li>
								</ul>
							</div>
						</div>

						<div class="card preset-outlined-warning-500 p-3">
							<h4 class="mb-2 font-semibold">⚠️ Important Recommendations</h4>
							<ul class="space-y-2 text-sm">
								<li class="flex items-start">
									<span class="mr-2">•</span>
									<span
										><strong>Auto-invest most dividends</strong> - Prevents market bankruptcy</span
									>
								</li>
								<li class="flex items-start">
									<span class="mr-2">•</span>
									<span
										><strong>Reinvest regularly</strong> - Maintains your ownership share as others invest</span
									>
								</li>
							</ul>
						</div>

						<div>
							<h4 class="mb-2 font-semibold">Investment Timeline</h4>
							<div class="space-y-3 card preset-outlined-surface-500 p-3">
								<div class="grid grid-cols-1 gap-2 text-sm">
									<div class="flex items-center space-x-2">
										<span class="h-3 w-3 rounded-full bg-success-500"></span>
										<span
											><strong>Immediate:</strong> Balance decreases, funds available in market</span
										>
									</div>
									<div class="flex items-center space-x-2">
										<span class="h-3 w-3 rounded-full bg-warning-500"></span>
										<span
											><strong>Next dividend:</strong> Ownership share and investment amount updated</span
										>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/snippet}
			</Accordion.Item>
			<hr class="hr" />
			<Accordion.Item value="risks">
				{#snippet lead()}<Skull size={24} />{/snippet}
				{#snippet control()}Risks{/snippet}
				{#snippet panel()}
					<div class="space-y-4">
						<div class="card preset-filled-error-500 p-3">
							<h4 class="mb-2 font-semibold">⚠️ Investment Risks</h4>
							<div class="space-y-2 text-sm">
								<div class="flex items-start">
									<span class="mt-1 mr-2">•</span>
									<span
										><strong>No guaranteed profits</strong> - Returns depend on market sales</span
									>
								</div>
								<div class="flex items-start">
									<span class="mt-1 mr-2">•</span>
									<span>Market growth expected with regular sales activity</span>
								</div>
							</div>
						</div>

						<div>
							<h4 class="mb-2 font-semibold">Market Closure Process</h4>
							<div class="space-y-3 card preset-outlined-warning-500 p-3">
								<div class="text-sm">
									<p class="mb-2"><strong>Trigger:</strong> Manual action by administrators</p>
									<p class="mb-2"><strong>Best timing:</strong> When market has no product stock</p>
								</div>

								<div class="card preset-filled-surface-500 p-2">
									<h5 class="mb-1 font-semibold">Closure Distribution:</h5>
									<ul class="space-y-1 text-xs">
										<li><strong>1.</strong> Final dividend = entire market balance</li>
										<li><strong>2.</strong> Remaining stock divided equally among investors</li>
										<li><strong>3.</strong> Odd items distributed by ownership share</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				{/snippet}
			</Accordion.Item>
			<hr class="hr" />
			<Accordion.Item value="sweat">
				{#snippet lead()}<Pickaxe size={24} />{/snippet}
				{#snippet control()}Sweat Equity{/snippet}
				{#snippet panel()}
					<div class="space-y-4">
						<div class="card preset-filled-secondary-500 p-3">
							<h4 class="mb-2 font-semibold">What is Sweat Equity?</h4>
							<p class="mb-2 text-sm opacity-75">
								Non-monetary contributions that add value to the market
							</p>
							<div class="grid grid-cols-2 gap-2 text-xs">
								<div class="card preset-outlined-surface-500 p-2">
									<span class="font-medium">Examples:</span>
									<ul class="mt-1 space-y-1">
										<li>• Sales bonuses</li>
										<li>• Product research</li>
									</ul>
								</div>
								<div class="card preset-outlined-surface-500 p-2">
									<span class="font-medium">More examples:</span>
									<ul class="mt-1 space-y-1">
										<li>• Product purchasing</li>
										<li>• Market improvements</li>
									</ul>
								</div>
							</div>
						</div>

						<div class="card preset-outlined-primary-500 p-3">
							<h4 class="mb-2 font-semibold">How It's Determined</h4>
							<ul class="space-y-1 text-sm">
								<li class="flex items-start">
									<span class="mr-2">•</span>
									<span><strong>Administrator decides</strong> the amount</span>
								</li>
								<li class="flex items-start">
									<span class="mr-2">•</span>
									<span><strong>Based on contribution value</strong>, not time spent</span>
								</li>
								<li class="flex items-start">
									<span class="mr-2">•</span>
									<span><strong>Fractional units</strong> are common</span>
								</li>
							</ul>
						</div>

						<div class="card preset-outlined-warning-500 p-3">
							<h4 class="mb-2 font-semibold">⚠️ Important Warning</h4>
							<div class="space-y-2 text-sm">
								<p><strong>Don't rely on sweat equity as primary income</strong></p>
								<ul class="ml-2 space-y-1">
									<li>• Costs other investors real money</li>
									<li>• Difficult to obtain consistently</li>
									<li>• Value may decrease quickly</li>
								</ul>
								<div class="mt-2 card preset-outlined-surface-500 p-2">
									<p class="text-xs">
										<strong>Better alternatives:</strong> Sales commissions or traditional investments
									</p>
								</div>
							</div>
						</div>
					</div>
				{/snippet}
			</Accordion.Item>
		</Accordion>
	</div>
</div>
