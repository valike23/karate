<script context="module">
    export async function preload(page) {
      const res = await this.fetch(`api/pools`,{method: 'PATCH'});
      const res2 = await this.fetch(`api/kata`);
      const katas = await res2.json();
      const pools = await res.json();
      console.log(katas);
      return { pools, katas };
    }
  </script>

<script lang="ts">
import axios from "axios";

import { onMount } from "svelte";

  import Nav from "../components/Nav.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import type {Iathlete, Ikata, Ipool} from '../model/application';
  let active = "control";
  export let pools: Ipool[], katas: Ikata[];
  let poolAthletes: Iathlete[] = [];
  let kata ='';
  let win, modal;
  let socket;
  let nextActivePool = pools.find((p)=>{
    return p.active_time;
  }) || pools[0];
  let activePool:Ipool ={};
  let activeAthlete:Iathlete = {};
  let nextAthlete:Iathlete = {};
 const assignKata =async ()=>{
    try {
       let data = await axios.put(`api/pool_athlete?pool=${activePool.id}&kata=${kata}&athlete=${activeAthlete.id}`);
        if(data.data){
            socket.emit('display athlete',{kata, activeAthlete})
            win.Swal.fire({
     icon: 'success',
     title:'set athlete',
     'text': 'the current athlete kata have been set, you can start the competition anytime you like'
   })
        }
    } catch (error) {
        win.Swal.fire({
     icon: 'error',
     title:'failed',
     'text': 'failed to set kata'
   })
    }
 }
  const start =async () => {
      activePool = nextActivePool;
      let display = {
          screen: 'pool',
          pool: nextActivePool
      };


      socket.emit('show pool',display);
     let poolath = await axios.get(`api/pool_athlete?id=${activePool.id}`);
     console.log(poolath.data);
     poolAthletes = poolath.data.athletes;
     let count = 0;
     for (let index = 0; index < poolAthletes.length; index++) {
         const element = poolAthletes[index];
         if(element.active_time == null){
            if(count == 0){
                activeAthlete = element;
                count = count + 1;
            }
            else{
                nextAthlete = element;
                break;
            }
         }
         
     }

  }

  onMount(()=>{
      win = window;
    socket = win.io("/display");
    socket.on("connect", () => {
      console.log(socket.id);
    });
  })
  const openKataModal =()=>{
    modal = new win.bootstrap.Modal(document.getElementById("kata"), {
        keyboard: false,
        backdrop: "static",
      }).show();
  }
  const startAthlete = ()=>{

  }
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
              <input class="form-control" type="text" value="{activeAthlete.first_name + " " + activeAthlete.last_name}" disabled />
            </div>
          </div>
          <div class="col-6 col-sm-3">
            <div class="form-group">
              <label for="">next athlete</label>
              <input class="form-control" type="text" value="{nextAthlete.first_name + " " + nextAthlete.last_name}" disabled />
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
        <div class="col-12 col-sm-3">
          <div on:click="{start}" class="button btn bg-primary">start pool</div>
        </div>
        <div class="col-12 col-sm-3">
          <div class="button btn bg-secondary ">Next Athlete</div>
        </div>
        <div class="col-12 col-sm-3">
            <div class="button btn bg-secondary " on:click="{openKataModal}">Start Active Athlete</div>
          </div>
        <div class="col-12 col-sm-3">
          <div class="button btn bg-primary ">End Pool</div>
        </div>
      </div>
  </div>
</main>
<div id="kata" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <form on:submit|preventDefault={assignKata} class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Pick a Kata</h5>
        </div>
        <div class="modal-body">
          <div class="col-12 col-sm-6">
            <div class="form-group">
              <label for="name">Kata </label>
              <select  bind:value="{kata}" required class="form-control" >
                <option value="">Pick a kata the athlete will perform</option>
                {#each katas as item}
                     <option value="{item.kata_name}">{item.kata_name}</option>
                {/each}
                </select>
            </div>
          </div>
          <div class="col-12 col-sm-6">
            <div class="form-group">
              <label for="name">Athlete </label>
              <input  value="{activeAthlete.first_name + ' ' + activeAthlete.last_name}" required class="form-control" type="text" />
            </div>
          </div>
        
        </div>
        <div class="modal-footer">
          <input type="submit" class="btn btn-primary" />
        </div>
      </form>
    </div>
  </div>
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
  .form-control {
    border: 1px solid gainsboro;
    padding-left: 5px;
  }
</style>
