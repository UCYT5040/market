<script lang="ts">
    import { Tooltip } from '@skeletonlabs/skeleton-svelte';
    import type { PageProps } from './$types';

    let {data}: PageProps = $props();

    let sweatEquityTooltip = $state(false);
</script>

<div class="flex flex-col items-center justify-center h-screen w-full">
    <div class="flex w-full justify-center gap-4 mb-8">
        <div class="card p-4 preset-outlined-surface-500 w-full max-w-md">
            <h2 class="text-lg">
                Balance
            </h2>
            <p class="text-3xl font-semibold">
                $99.99
            </p>
        </div>
        <div class="card p-4 preset-outlined-surface-500 w-full max-w-md">
            <h2 class="text-lg">
                Investments
            </h2>
            <div class="flex gap-4">
                <div>
                    <p class="text-small">
                        Money
                    </p>
                    <p class="text-xl font-semibold">
                        $99.99
                    </p>
                </div>
                <div>
                    <p class="text-small">
                        Sweat
                    </p>
                    <p class="text-xl font-semibold">
                        1 unit
                    </p>
                    <Tooltip open={sweatEquityTooltip} onOpenChange={(e) => sweatEquityTooltip = e.open}
                             positioning={{ placement: 'top' }}
                             triggerBase="underline"
                             contentBase="card preset-filled p-4"
                             openDelay={200}
                             arrow
                    >
                        {#snippet trigger()}($7.25){/snippet}
                        {#snippet content()}For the purpose of ownership calculation, sweat equity is multiplied by the federal minimum wage to determine it's value.{/snippet}
                    </Tooltip>
                </div>
                <div>
                    <p class="text-small">
                        Ownership
                    </p>
                    <p class="text-xl font-semibold">
                        {data.ownership * 100}%
                    </p>
                </div>
            </div>
        </div>
        <div class="card p-4 preset-outlined-surface-500 w-full max-w-md">
            <h2 class="text-lg">
                Performance
            </h2>
            <p class="text-3xl font-semibold">
                5 sales
            </p>
            <p class="text-small">
                Top 10% of all members
            </p>
        </div>
    </div>
</div>