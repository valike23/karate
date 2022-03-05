<script context="module">
  export async function preload(page) {
    console.log(page.query);
    let query = page.query;
    //retrieve all records needed to work this page
  
    const categoryId = query.id;
    const res = await this.fetch(`api/pools?id=${query.id}`, { method: "PUT" });
    const pools = await res.json();
    console.log(pools);
    return { pools, categoryId };
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  import Nav from "../components/Nav.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import type { Ipool} from "../model/application";

  export let pools: Ipool[];
  let win: any = {};
  let active = "competition";
  console.log(pools);
  let groups: Ipool[] = [];
    const openResult = (pool)=>{
        location.href = `/pool_details?id=${pool.id}&name=${pool.pool_name}`;
    }

  onMount(()=>{
    console.log(pools);
    console.log(groups);
    
    
  })

  
</script>

<Sidebar {active} />
<main
  class="main-content position-relative max-height-vh-100 h-100 border-radius-lg "
>
  <Nav />

  <div class="container-fluid py-4">
    <div class="row">
      <h3>View Pools</h3>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="table-responsive">
                  <table class="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7">s/n</th>
                        <th class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2">pool name</th>
                        <th class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2">active time</th>
                        <th colspan="2" class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2">actions</th>
                     
                      </tr>
                    </thead>
                    <tbody>
                    {#each pools as pool, i}
                    <tr>
                        <td>
                            <p class="text-xs text-center font-weight-bold mb-0">{i + 1}</p>
                          </td>
                        <td>
                          <p class="text-xs text-center font-weight-bold mb-0">{pool.pool_name}</p>
                        </td>
                        <td>
                            <p class="text-xs text-center font-weight-bold mb-0">{pool.active_time}</p>
                          </td>
                      
                      <td class="text-center">
                          <button on:click="{()=>{openResult(pool)}}" class="btn btn-primary">view pool result</button>
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


<style>
  
</style>
