<script lang="ts">
	import type { PageProps } from "./$types";

    let {data}: PageProps = $props();
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <div class="card p-4 preset-outlined-surface-500 w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">
            Approve a User
        </h1>
        <form method="POST">
            <label class="label mb-4">
                <span class="label-text">User</span>
                <select name="userId" class="input w-full" required>
                    <option value="" disabled selected>Select a user</option>
                    {#each data.users as user}
                        <option value={user.$id}>{user.name} ({user.email})</option>
                    {/each}
                </select>
            </label>
            <button type="submit" class="btn preset-filled-primary-500 w-full">Approve User</button>
        </form>
    </div>
</div>
