<script context="module">
    export async function preload(page) {
      const res = await this.fetch(`api/pools`,{method: 'PATCH'});
      const pools = await res.json();
      console.log(pools);
      return { pools };
    }
  </script>

<script lang="ts">
import axios from "axios";

import { onMount } from "svelte";

  import Nav from "../components/Nav.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import type {Iathlete, Ipool} from '../model/application';
  let active = "control";
  export let pools: Ipool[];
  let win;
  let socket;
  let nextActivePool = pools.find((p)=>{
    return p.active_time;
  }) || pools[0];
  let activePool:Ipool ={};
  let activeAthlete:Iathlete = {};
  let nextAthlete:Iathlete = {};
 
  const start =async () => {
      activePool = nextActivePool;
      let display = {
          screen: 'pool',
          pool: nextActivePool
      };


      socket.emit('show pool',display);
     let poolath = await axios.get(`api/pool_athlete?id=${activePool.id}`);
     console.log(poolath.data);

  }

  onMount(()=>{
      win = window;
    socket = win.io("/display");
    socket.on("connect", () => {
      console.log(socket.id);
    });
  })
</script>


<Sidebar {active} />
<main
  class="main-content position-relative max-height-vh-100 h-100 border-radius-lg "
>
  <Nav />

  <div class="container-fluid py-4">
    <div class="row mb-5">
        <div class="col-6 col-sm-3">
            <div class="form-group">
              <label for="">active pool</label>
              <input class="form-control" bind:value="{activePool.pool_name}" type="text"  disabled />
            </div>
          </div>
          <div class="col-6 col-sm-3">
            <div class="form-group">
              <label for="">active athlete</label>
              <input class="form-control" type="text" value="" disabled />
            </div>
          </div>
          <div class="col-6 col-sm-3">
            <div class="form-group">
              <label for="">next athlete</label>
              <input class="form-control" type="text" value="" disabled />
            </div>
          </div>
          <div class="col-6 col-sm-3">
            <div class="form-group">
              <label for="">next pool</label>
              <input bind:value="{nextActivePool.pool_name}" class="form-control" type="text" disabled />
            </div>
          </div>
    </div>

    <div class="row mt-5">
        <div class="col-12 col-sm-4">
          <div on:click="{start}" class="button btn bg-primary">start pool</div>
        </div>
        <div class="col-12 col-sm-4">
          <div class="button btn bg-secondary ">Next Athlete</div>
        </div>
        <div class="col-12 col-sm-4">
          <div class="button btn bg-primary ">End Pool</div>
        </div>
      </div>
  </div>
</main>
<style>
  .button {
    width: 80%;
    height: 15vh;
    color: white;
    text-align: center;
    font-weight: 600;
    font-size: 1.3rem;
    margin: 0 auto;
  }
</style>
