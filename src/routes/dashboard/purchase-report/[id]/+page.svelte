<script lang="ts">
    import {Avatar} from '@skeletonlabs/skeleton-svelte';
    import type {PageProps} from './$types';
    import {onMount} from 'svelte';
    import {toaster} from '$lib/toaster';
    import PreviewImage from '$lib/components/PreviewImage.svelte';

    let {data, form}: PageProps = $props();

    onMount(() => {
        if (form && !form.success) {
            toaster.error({
                title: 'Error',
                description: form.message || 'An error occurred. Please try again.'
            });
        }
    });
</script>

<div class="flex flex-col items-center justify-center h-full">
    <div class="card p-4 preset-outlined-surface-500 w-full max-w-lg max-h-7/8 overflow-y-auto p-4">
        <h1 class="text-2xl font-bold mb-6 text-center">Purchase Report</h1>
        {#if data.report.status === 'pending'}
            <div class="badge preset-tonal-warning mb-2 float-right">
                Pending
            </div>
        {:else if data.report.status === 'approved'}
            <div class="badge preset-tonal-success mb-2 float-right">
                Approved
            </div>
        {:else if data.report.status === 'denied'}
            <div class="badge preset-tonal-error mb-2 float-right">
                Denied
            </div>
        {:else}
            <div class="badge preset-tonal-surface mb-2 float-right">
                Unknown Status
            </div>
        {/if}
        <h2 class="text-xl font-bold mb-2">${data.report.total} - {data.report.items.length} Items</h2>
        <div class="flex items-center gap-2 mb-2">
            <Avatar name={data.report.username} size="size-8" />
            <span class="ml-2">{data.report.username}</span>
        </div>
        <ul class="list-disc pl-5">
            {#each data.report.items as item}
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
        <p class="mb-2">
            <span class="text-lg"><strong>Total:</strong> ${data.report.total}</span>
            <span class="text-gray-500">
                    (untaxed: ${data.report.totalUntaxed})
                </span>
            {#if data.report.totalLocalPrice}
                {@const localDiff = data.report.totalLocalPrice - data.report.totalUntaxed}
                {#if localDiff > 0}
                    <span class="text-green-500">(save ${localDiff.toFixed(2)})</span>
                {:else if localDiff < 0}
                    <span class="text-red-500">(extra ${Math.abs(localDiff).toFixed(2)})</span>
                {:else}
                    <span class="text-gray-500">(no difference)</span>
                {/if}
            {/if}
        </p>
        <h2 class="text-lg font-bold mb-2">Attachments</h2>
        {#if data.report.attachments.length > 0}
            {#each data.report.attachments as attachment}
                <div class="card p-4 mb-2 preset-outlined-surface-500">
                    <div class="flex items-center gap-2 mb-2">
                        <Avatar name={attachment.username} size="size-6" />
                        <span class="font-semibold">{attachment.username}</span>
                    </div>
                    <p class="text-sm text-gray-500 mb-2">
                        {attachment.$createdAt}
                    </p>
                    {#if attachment.type === 'image'}
                        <PreviewImage image={attachment.image} alt="Attachment Image" />
                    {:else if attachment.type === 'text'}
                        <pre class="bg-gray-900 p-2 rounded">{attachment.value}</pre>
                    {/if}
                </div>
            {/each}
        {:else}
            <p class="text-gray-500">No attachments available.</p>
        {/if}
        <h2 class="text-lg font-bold mb-2">Add attachments</h2>
        <form class="flex mb-4" action="?/attachImage" method="post" enctype="multipart/form-data">
            <input type="file" name="image" accept="image/*" class="file-input preset-tonal-surface-500 w-full max-w-xs" />
            <button type="submit" class="btn preset-filled-primary-500 ml-2">
                Attach
            </button>
        </form>
        <form action="?/attachText" method="post">
            <textarea name="text" rows="3" class="textarea preset-tonal-surface-500 w-full mb-4" placeholder="Add text attachment"></textarea>
            <button type="submit" class="btn preset-filled-primary-500 w-full">
                Attach Text
            </button>
        </form>
        {#if data.admin}
            <h2 class="text-lg font-bold mb-2">Admin Actions</h2>
            <form action="?/adminApprove" method="post" class="mb-4">
                <button type="submit" class="btn preset-filled-success-500 w-full">
                    Approve Report
                </button>
            </form>
            <form action="?/adminDeny" method="post">
                <button type="submit" class="btn preset-filled-error-500 w-full">
                    Deny Report
                </button>
            </form>
        {/if}
    </div>
</div>
