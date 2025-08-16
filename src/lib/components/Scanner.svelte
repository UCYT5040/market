<script lang="ts">
    import Quagga, {type QuaggaJSResultObject} from '@ericblade/quagga2';

    import {onMount} from 'svelte';

    let scanner: HTMLDivElement;
    let {scanning, onScan}: {
        scanning: boolean;
        onScan: (code: string | null) => void;
    } = $props();

    let detections: Record<string, number> = {};

    function onDetected(data: QuaggaJSResultObject) {
        const code = data.codeResult.code;
        if (!code) {
            return; // Ignore empty detections
        }
        if (!detections[code]) {
            detections[code] = 1;
        } else {
            detections[code]++;
        }
        if (detections[code] > 3) {
            onScan(code);
            scanning = false;
            Quagga.stop();
        }
    }

    onMount(() => {
        window.q = Quagga;
    });

    $effect(() => {
        if (scanning) {
            Quagga.init({
                inputStream: {
                    type: 'LiveStream',
                    constraints: {
                        facingMode: 'environment'
                    },
                    target: scanner
                },
                decoder: {
                    readers: [
                        'upc_reader',
                        'upc_e_reader'
                    ]
                }
            }).then(() => {
                Quagga.start();
            });

            Quagga.onDetected(onDetected);

        } else {
            Quagga.offDetected(onDetected);
            Quagga.stop();
        }
    });
</script>

{#if scanning}
<div bind:this={scanner}
     class="fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50"></div>

<button class="btn btn-danger fixed bottom-4 right-4 z-10"
        onclick={() => {
            onScan(null);
        }
        }>
    Cancel
</button>
    {/if}