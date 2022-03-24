<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload() {
      const res = await this.fetch(`api/club`);
      const clubs = await res.json();
      return { clubs };
    }
  </script>


<script lang="ts">
import Nav from "../components/Nav.svelte";
import Sidebar from "../components/Sidebar.svelte";
import type { Iclub } from "../model/application";
let active ="club";
export let clubs:Iclub[];
</script>


<Sidebar {active}/>
<main
  class="main-content position-relative max-height-vh-100 h-100 border-radius-lg "
>
<Nav/>


<div class="container-fluid py-4">
    <div class="row">
      <h3>Manage Clubs</h3>
    </div>
</div>
</main>