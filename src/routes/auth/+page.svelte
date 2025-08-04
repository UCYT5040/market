<script lang="ts">
    import type {PageProps} from './$types';
    import {toaster} from '$lib/toaster';
    import {onMount} from 'svelte';

    let action: 'login' | 'register' = $state('login');

    function toggleAction() {
        action = action === 'login' ? 'register' : 'login';
    }

    let {form}: PageProps = $props();
    onMount(() => {
        if (form && !form.success) {
            toaster.error({
                title: 'Error',
                description: form.message || 'An error occurred. Please try again.'
            });
        } else if (form && form.success && form.message === 'registrationSuccess') {
            toaster.success({
                title: 'Registration Successful',
                description: 'You can now log in with your credentials.'
            });
            action = 'login';
        }
    });

</script>

<svelte:head>
    <title>{
        action === "login" ? "Login" : "Register"
    }</title>
</svelte:head>

<div class="flex flex-col items-center justify-center h-screen">
    <div class="card p-4 preset-outlined-surface-500 w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">
            {action === "login" ? "Login" : "Register"}
        </h1>
        <form action={`?/${action}`} class="space-y-4" method="POST">
            <label class="label">
                <span class="label-text">Email</span>
                <input class="input" name="email" placeholder="Enter your email" required type="email"/>
            </label>
            <label class="label">
                <span class="label-text">Password</span>
                <input class="input" name="password" placeholder="Enter Password" required type="password"/>
            </label>
            {#if action === "register"}
                <label class="label">
                    <span class="label-text">Confirm Password</span>
                    <input type="password" class="input" placeholder="Confirm Password" name="confirmPassword"
                           required/>
                </label>
                <label class="label">
                    <span class="label-text">Full Name</span>
                    <input type="text" class="input" placeholder="Enter your full name" name="name" required/>
                </label>
            {/if}
            <button class="btn preset-filled-primary-500 w-full" type="submit">
                {action === "login" ? "Login" : "Register"}
            </button>
        </form>
        <button class="w-full text-center text-surface-500 mt-4 underline" onclick={toggleAction} type="button">
            {action === "login" ? "Register instead" : "Login instead"}
        </button>
    </div>
</div>