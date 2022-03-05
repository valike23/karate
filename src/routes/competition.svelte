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
      const res2 = await this.fetch(`api/competition`);
      const competitions = await res2.json();
      
      return {  competitions};
    }
  </script>
  


<script lang="ts">
import Nav from "../components/Nav.svelte";
import Sidebar from "../components/Sidebar.svelte";
import type { Icategory, Icompetition } from "../model/application";
import {goto} from '@sapper/app';
import axios from "axios";
import { onMount } from "svelte";
let win;
let competition: Icompetition = {};
let active = 'category';
export let competitions: Icompetition[];
const manage = (competition: Icompetition) => {
    goto('pools_summary?id='+ competition.id)
}
const submit =async ()=>{
  let form = new FormData();
  form.append('competition', JSON.stringify(competition));
  try {
    let res = await axios.post(`api/competition`, form);
    if(res){
      console.log(res.data);
      win.Swal.fire({
     icon: 'success',
     title:'competition created',
     'text': 'competition have been created successfully.'
   }).then(()=>{
     competition.id = res.data.insertId;
    competitions.push(competition);
    competition = competition;
    competition ={};
   })
    }
  } catch (error) {
    win.Swal.fire({
     icon: 'error',
     title:'you cant start this category',
     'text': 'you can\'t start this category because there is already an active category.'
   })
  }
}
onMount(()=>{
  win = window;
})
const start = async (category: Icategory)=>{
  //check if they are pools in this category
 let res = await axios.get(`api/pools?id=${category.id}`);
 if(res.data.length > 0){
    //start the current category and set
    //there have to be no active category

    let res2 = await axios.patch(`api/category`);
    if(res2.data.length == 0){
      let respond = await axios.put(`api/category?id=`+ category.id);
    if(respond.data){
      console.log(respond.data);
      win.Swal.fire({
     icon: 'success',
     title:'category have been activated',
     'text': 'category have been activated successfully.'
   })
    }
    }
    else{
      win.Swal.fire({
     icon: 'error',
     title:'you cant start this category',
     'text': 'you can\'t start this category because there is already an active category.'
   })
    }
   
 }
 else{
   win.Swal.fire({
     icon: 'error',
     title:'you cant start this category',
     'text': 'you can\'t start this category because this category does not have a pool.'
   })
 }
}

const stop =async (category:Icategory) => {
  if(category.active){

    let respond = await axios.put(`api/category?id=${category.id}&status=deactivate`);
    if(respond.data){
      win.Swal.fire({
     icon: 'sucess',
     title:'category stopped',
     'text': 'the current category has been stopped.'
   });
 
    }
  }
  else{
    win.Swal.fire({
     icon: 'error',
     title:'category is not active',
     'text': 'the current category is not active so cannot be deactivated.'
   })
  }
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
        <h3>Manage Competition</h3>
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
                    <th class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2">status</th>
                    <th colspan="2" class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2">actions</th>
                 
                  </tr>
                </thead>
                <tbody>
                {#each competitions as competition, i}
                <tr>
                    <td>
                        <p class="text-xs text-center font-weight-bold mb-0">{i + 1}</p>
                      </td>
                    <td>
                      <p class="text-xs text-center font-weight-bold mb-0">{competition.competition_name}</p>
                    </td>
                    <td>
                        <p class="text-xs text-center font-weight-bold mb-0">{competition.status}</p>
                      </td>
                    <td colspan="2" class="text-center">
                       {#if competition.status == 'inactive'}

                       <button class="btn btn-success btn-sm" on:click="{()=>{start(competition)}}">Activate Competition</button>
                      
                        <button class="btn btn-warning btn-sm" on:click="{()=>{stop(competition)}}">stop category</button>

                        {:else if  competition.status == 'active'}
                        <button class="btn btn-primary btn-sm" on:click="{()=>{manage(competition)}}">view pools summary</button>

                        <button class="btn btn-warning btn-sm" on:click="{()=>{stop(competition)}}">stop competition</button>
                       
                        {:else}
                        <button class="btn btn-primary btn-sm" on:click="{()=>{manage(competition)}}">view pools summary</button>

                        <button class="btn btn-warning btn-sm" on:click="{()=>{stop(competition)}}">stop competition</button>
                       
                        {/if}
                       
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

<div style="background-color: #F11C68; color: white" class="fixed-plugin">
  <!-- svelte-ignore a11y-missing-attribute -->
  <a
  style="background-color: #F11C68; color: white"
    data-bs-toggle="offcanvas"
    data-bs-target="#competitionCanvas"
    aria-controls="competitionCanvas"
    class="fixed-plugin-button text-dark position-fixed px-3 py-2"
  >
    <i style="color: white;" class="material-icons py-2">add</i>
  </a>
</div>
<div
  style="background-color: black; color: white;"
  class="offcanvas offcanvas-start"
  tabindex="-1"
  id="competitionCanvas"
  aria-labelledby="competitionCanvasLabel"
>
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="competitionCanvasLabel">Add Competition</h5>
    <button
      type="button"
      class="btn-close text-reset"
      data-bs-dismiss="offcanvas"
      aria-label="Close"><i class="material-icons py-2">times</i></button
    >
  </div>
  <div class="offcanvas-body">
    <form on:submit|preventDefault={submit} class="row">
      <div class="col-12 mb-2">
        <div class="form-group">
          <label for="firstname" class="form-label">Category Name</label>
          <input
            bind:value={competition.competition_name}
            required
            type="text"
            class="form-control"
            id="firstname"
            placeholder="enter category name"
          />
        </div>
      </div>
     
      <div class="col-12 mb-2">
        <input value="submit" class="btn btn-primary" type="submit" />
      </div>
    </form>
  </div>
</div>

</main>
<style>
  #competitionCanvasLabel{
    color: white;
  }
  input{
    border: 2.5px solid white;
    color: white;
    font-size: 1.5 rem;
  }
</style>