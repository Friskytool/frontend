<script>
  import "./global.css";
  import Router, { location } from "svelte-spa-router";
  import Nav from "./lib/Nav.svelte";
  import Side from "./lib/SideBar.svelte";
  import Home from "./pages/Home.svelte";
  import App from "./pages/Selector.svelte";
  import Plugins from "./pages/Plugins.svelte";
  import Callback from "./pages/Callback.svelte";
  import Stats from "./pages/Stats.svelte";
  import Plugin from "./pages/Plugin.svelte";
  import CustomBot from "./pages/CustomBot.svelte";
  import Giveaways from "./pages/Giveaways.svelte";
  let s = "";
  let nav = $location.substring(0, $location.length - 1).startsWith("/app/");
  $: s = nav ? "flex" : "";
  location.subscribe((newLocation) => {
    nav = newLocation.substring(0, newLocation.length - 1).startsWith("/app/");
  });

  const routes = {
    "/": Home,
    "/callback": Callback,
    "/app": App,
    "/app/:id": Plugins,
    "/app/:id/plugins/:plugin": Plugin,
    "/app/:id/custom-bot": CustomBot,
    "/app/:id/giveaways": Giveaways,
    "/stats": Stats,
  };
</script>

<div class="dark {s} dark:text-white">
  {#if !nav}
    <Nav />
  {:else}
    <Side />
  {/if}
  <Router {routes} />
</div>
