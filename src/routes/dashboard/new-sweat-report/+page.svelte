<script lang="ts">
	import { toaster } from '$lib/toaster';
	import { onMount } from 'svelte';

    let {form} = $props();

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
        <h1 class="text-2xl font-bold mb-6 text-center">Sweat Report</h1>
        <form class="w-full" method="POST">
            <label class="label">
                <span class="label-text">Reason</span>
                <textarea class="textarea w-full" placeholder="Enter a detailed reason for report"
                maxlength="4096" name="reason"></textarea>
            </label>
            <label class="label">
                <span class="label-text">Amount</span>
                <input type="number" class="input w-full" placeholder="Units of sweat equity" step="0.0001" min="0" name="amount"/>
            </label>
            <button class="btn preset-filled-primary-500 w-full" type="submit">
                Submit Report
            </button>
        </form>
    </div>
</div>
