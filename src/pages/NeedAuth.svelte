<script>
    import { onMount } from "svelte";

    export let from = `/`;

    onMount(async () => {
        let resp = await fetch("/api/user");
        let user = await resp.json();

        if (user) {
            window.location.href = from;
        }
    });
</script>

<div class="container">
    <div class="row">
        <div class="col-md-5">
            <div class="card">
                <div class="card-header">Sign in</div>
                <div class="card-body">You must sign in to view this page.</div>
            </div>
        </div>
    </div>
</div>
