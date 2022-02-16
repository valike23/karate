<script context="module">
    export async function preload(page) {
      const res2 = await this.fetch(`api/ip`);
      let ips = await res2.json();
      ips = ips.en0;
      console.log(ips);
      return { ips };
    }
  </script>


<script>
import Nav from "../components/Nav.svelte";
import Sidebar from "../components/Sidebar.svelte";
let active = 'links';
export let ips;
console.log(ips);
</script>
<Sidebar {active}/>
<main
  class="main-content position-relative max-height-vh-100 h-100 border-radius-lg "
>
<Nav/>

<div class="container-fluid py-4">
    <div class="row mb-5">
        <div class="col-3">
            <span class="material-icons">desktop_windows</span>

        </div>
        <div class="col-5">
            <p>Display on desktop links</p>
        </div>
        <div class="col-4">
            <a target="_blank" href="{`http://`+ ips[0] + `:3000/display`}">link to public display</a>
        </div>
    </div>
    <div class="row mb-5">
        <div class="col-3">
            <span class="material-icons">gavel</span>

        </div>
        <div class="col-5">
            <p>Display for judges links</p>
        </div>
        <div class="col-4">
            <a target="_blank" href="{`http://`+ ips[0] + `:3000/judges_screen`}">link to judges display</a>
        </div>
    </div>
</div>

</main>