<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
      // the `slug` parameter is available because this file
      // is called [slug].svelte
      const { slug } = page.params;
  
      // `this.fetch` is a wrapper around `fetch` that allows
      // you to make credentialled requests on both
      // server and client
      const res2 = await this.fetch(`api/category`);
      const categories = await res2.json();
      
      return {  categories};
    }
  </script>
  


<script lang="ts">
import Nav from "../components/Nav.svelte";
import Sidebar from "../components/Sidebar.svelte";
import type { Icategory } from "../model/application";
import {goto} from '@sapper/app';
let active = 'category';
export let categories: Icategory[];
const manage = (category: Icategory) => {
    goto('pools?id='+ category.id)
}
</script>



<Sidebar {active}/>
<main
class="main-content position-relative max-height-vh-100 h-100 border-radius-lg "
>
<Nav/>

<div class="container-fluid py-4">
<div class="row">
    <div class="col-12">
        <h3>manage category</h3>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7">s/n</th>
                    <th class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2">category name</th>
                    <th colspan="2" class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2">actions</th>
                 
                  </tr>
                </thead>
                <tbody>
                {#each categories as category, i}
                <tr>
                    <td>
                        <p class="text-xs text-center font-weight-bold mb-0">{i + 1}</p>
                      </td>
                    <td>
                      <p class="text-xs text-center font-weight-bold mb-0">{category.category_name}</p>
                    </td>
                    <td colspan="2" class="text-center">
                        <button class="btn btn-primary btn-sm" on:click="{()=>{manage(category)}}">manage pools</button>
                        <button class="btn btn-success btn-sm">start category</button>
                        <button class="btn btn-warning btn-sm">stop category</button>

                    </td>
                  
                  </tr>
                {/each}
          
          
                </tbody>
              </table>
            </div>
            </div>
    </div>
</div>
</div>


</main>