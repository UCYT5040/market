<script lang="ts">
    import type {PageProps} from './$types';
    import {Avatar} from '@skeletonlabs/skeleton-svelte';
    import { page } from '$app/state';
	import { goto } from '$app/navigation';

    let {data}: PageProps = $props();

    const params = page.url.searchParams;

    let statusFilter = $state(params.get("status"));
    let includeAll = $state(params.get("includeAll") === "true"); // If false, only include reports made by the current user
    let pageNumberString = $state(params.get("page"));

    let pageNumber = $derived(pageNumberString ? parseInt(pageNumberString) : 1);

    const urlParamString = $derived.by(() => {
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);
        if (includeAll) params.set("includeAll", "true");
        if (pageNumber > 1) params.set("page", pageNumber.toString());
        const paramString = params.toString();
        return paramString ? `?${paramString}` : '';
    });

    $effect(() => {
        goto(urlParamString);
    })
</script>

<h1 class="text-2xl font-bold mt-2 mb-6 text-center">
    Purchase Reports
</h1>
<div class="flex justify-center gap-4 mb-6">
    <select bind:value={statusFilter} class="input preset-outlined-surface-500">
        <option value="all" selected={statusFilter === 'all'}>All Statuses</option>
        <option value="pending" selected={statusFilter === 'pending' || !statusFilter}>Pending</option>
        <option value="approved" selected={statusFilter === 'approved'}>Approved</option>
        <option value="denied" selected={statusFilter === 'denied'}>Denied</option>
    </select>
    <label class="flex items-center gap-2">
        <input type="checkbox" bind:checked={includeAll} class="checkbox preset-outlined-surface-500" />
        Include All Users
    </label>
</div>
<div>
    <p>Page {pageNumber}</p>
    <div class="pagination">
        <button onclick={() => pageNumber -= 1} disabled={pageNumber === 1}>Previous</button>
        <button onclick={() => pageNumber += 1}>Next</button>
    </div>
</div>
<div class="h-screen w-full grid grid-cols-3 gap-4 p-4 justify-items-center items-start">
    {#each data.reports as report}
        <div class="card p-4 preset-outlined-surface-500 w-full max-w-md">
            {#if report.status === 'pending'}
                <div class="badge preset-tonal-warning mb-2 float-right">
                    Pending
                </div>
            {:else if report.status === 'approved'}
                <div class="badge preset-tonal-success mb-2 float-right">
                    Approved
                </div>
            {:else if report.status === 'denied'}
                <div class="badge preset-tonal-error mb-2 float-right">
                    Denied
                </div>
            {:else}
                <div class="badge preset-tonal-surface mb-2 float-right">
                    Unknown Status
                </div>
            {/if}
            <h2 class="text-xl font-bold mb-2">${report.total} - {report.items.length} Items</h2>
            <div class="flex items-center gap-2 mb-2">
                <Avatar name={report.username} size="size-8" />
                <span class="ml-2">{report.username}</span>
            </div>
            <ul class="list-disc pl-5">
                {#each report.items as item}
                    <li>
                        {item.quantity}x <strong>{item.name}</strong> - ${item.price}
                        {#if item.localPrice}
                            {@const diff = item.localPrice * item.quantity - item.price}
                            {#if diff > 0}
                                <span class="text-green-500">(save ${diff.toFixed(2)})</span>
                            {:else if diff < 0}
                                <span class="text-red-500">(extra ${Math.abs(diff).toFixed(2)})</span>
                            {:else}
                                <span class="text-gray-500">(no difference)</span>
                            {/if}
                        {/if}
                    </li>
                {/each}
            </ul>
            <p>
                <strong>Total:</strong> ${report.total}
                <span class="text-gray-500">
                    (untaxed: ${report.totalUntaxed})
                </span>
                {#if report.totalLocalPrice}
                    {@const localDiff = report.totalLocalPrice - report.totalUntaxed}
                    {#if localDiff > 0}
                        <span class="text-green-500">(save ${localDiff.toFixed(2)})</span>
                    {:else if localDiff < 0}
                        <span class="text-red-500">(extra ${Math.abs(localDiff).toFixed(2)})</span>
                    {:else}
                        <span class="text-gray-500">(no difference)</span>
                    {/if}
                {/if}
            </p>
            <a class="btn preset-filled-primary-500 w-full mt-4" href={`/dashboard/purchase-report/${report.$id}`}>
                View Details
            </a>
        </div>
    {/each}
    {#if data.reports.length === 0}
        <p class="text-gray-500">No reports available.</p>
    {/if}
</div>