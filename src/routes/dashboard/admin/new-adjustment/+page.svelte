<script lang="ts">
	import { UserSearch } from "@lucide/svelte";


    let userQuery = $state("");
    let searched = $state(false);
    let results = $state([]);

    async function searchUsers() {
        const url = "/api/user?" + new URLSearchParams({ name: userQuery });
        const response = await fetch(url);
        if (response.ok) {
            results = (await response.json()).users.users
        }
        searched = true;
    }

    let selectedUserId: string | null = $state(null);
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<div class="w-full max-w-md card preset-outlined-surface-500 p-4">
		<h1 class="mb-6 text-center text-2xl font-bold">New Adjustment</h1>
		<form method="POST">
            {#if selectedUserId}
                <p class="mb-4">User selected.</p>
                <button class="underline font-semibold" onclick={() => selectedUserId = null}>Pick another user</button>
            {:else}
                <div class="flex gap-2 items-center">
                    <label class="label">
                        <span class="label-text">User</span>
                        <input type="text" class="input"
                        bind:value={userQuery}/>
                    </label>
                    <button
                        type="button"
                        class="btn preset-filled-primary-500"
                        onclick={() => searchUsers()}
                    >
                        <UserSearch />
                    </button>
                </div>
                {#if searched}
                    {#if results.length > 0}
                        <ul class="w-full">
                            {#each results as user}
                                <li class="flex items-center justify-between w-full">{user.name}
                                    <button type="button" class="underline font-semibold"
                                    onclick={() => selectedUserId = user.$id}
                                    >Select</button>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <p>No users found</p>
                    {/if}
                {/if}
            {/if}
            <input type="hidden" value={selectedUserId} name="user" />
            <label class="label mb-4 mt-4">
                <span class="label-text">Reason</span>
                <textarea name="reason" maxlength="4096" class="textarea"></textarea>
            </label>
            <p class="mb-4 font-semibold">For the following fields, set the value to zero (0) or leave the input blank to indicate no change.<br />
            To subtract, enter a negative value.
            </p>
            <label class="label mb-2">
                <span class="label-text">
                    Balance
                </span>
                <input type="number" name="balance" placeholder="Enter balance adjustment" class="input" />
            </label>
            <label class="label mb-2">
                <span class="label-text">
                    Monetary Investment
                </span>
                <input type="number" name="investment" placeholder="Enter monetary investment change" class="input" />
            </label>
            <label class="label mb-4">
                <span class="label-text">
                    Sweat Investment Adjustment
                </span>
                <input type="number" name="sweatInvestment" placeholder="Enter sweat investment adjustment" class="input" />
            </label>
            <p class="mb-4 font-semibold">
                For the following fields, set the value to negative one (-1) or leave the input blank to indicate no change.
                Zero (0) is a valid value for these fields.
            </p>
            <label class="label">
                <span class="label-text">
                    Commission Rate (% of profit, out of 100)
                </span>
                <input type="number" name="commissionRate" placeholder="Enter commission rate" class="input" />
            </label>
            <button type="submit" class="btn preset-filled-primary-500 mt-4 w-full">
                Submit Adjustment
            </button>
		</form>
	</div>
</div>
