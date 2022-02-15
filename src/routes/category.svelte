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
import axios from "axios";
import { onMount } from "svelte";
let win;
let active = 'category';
export let categories: Icategory[];
const manage = (category: Icategory) => {
    goto('pools?id='+ category.id)
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
   categories.forEach((c,i)=>{
      if(c.id == category.id) categories[i].active = false;
   })
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
                      <p class="text-xs text-center font-weight-bold mb-0">{#if category.active}
                        <span class="material-icons mr-2 " style="color: green"> check</span>
                      {/if}{category.category_name}</p>
                    </td>
                    <td colspan="2" class="text-center">
                        <button class="btn btn-primary btn-sm" on:click="{()=>{manage(category)}}">manage pools</button>
                        <button class="btn btn-success btn-sm" on:click="{()=>{start(category)}}">start category</button>
                        <button class="btn btn-warning btn-sm" on:click="{()=>{stop(category)}}">stop category</button>

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