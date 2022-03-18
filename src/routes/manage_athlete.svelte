<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload() {
    const res = await this.fetch(`api/athlete`);
    const res2 = await this.fetch(`api/category`);
    const res3 = await this.fetch(`api/club`);
    const athletes = await res.json();
    const categories = await res2.json();
    const clubs = await res3.json();
    return { athletes, categories, clubs };
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import Nav from "../components/Nav.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import axios from "axios";
  let files;
  import type { Iathlete, Icategory, Iclub } from "../model/application";
  let active = "athlete";
  let athlete :Iathlete= {};
  let win;
  let editAthlete: Iathlete ={};
  editAthlete.category ={};
  export let athletes: Iathlete[] = [{category: {category_name:''}}], categories: Icategory[] = [], clubs: Iclub[] = [];
 
async function deleteItem (this){
  if( confirm('are you sure you want to delete this athlete')){
    try {
  let id =this.id;
  let athlete = athletes[id];
  console.log(athlete);
  let res = await axios.delete('api/athlete?id='+ athlete.id);
  if(res){
   let data = await win.Swal.fire({
      title: 'Success',
      text: 'the item was deleted successfully',
      icon: 'success'
    });
    if(data){
      location.reload();
    }
  }
 } catch (error) {
  win.Swal.fire({
      title: 'error',
      text: 'something went wrong when deleting the athlete, please contact support',
      icon: 'error'
    });
    console.log(error);
 }
  }
};


async function editItem (this){
  if( confirm('are you sure you want to edit this athlete')){

  let id =this.id;
  editAthlete = athletes[id];
  console.log(editAthlete);
  var myOffcanvas = document.getElementById('editCanvas');
var bsOffcanvas = new win.bootstrap.Offcanvas(myOffcanvas);
bsOffcanvas.show();
  }
}

  onMount(() => {
    win = window;
    const dataTable = new win.simpleDatatables.DataTable("#myTable", {
      searchable: true,
      fixedHeight: false,
      columns:[ {
            select: 7,
            searchable: false,
            render: function(data, cell, row) {
                return data + "<i style='color: blue' class='material-icons' id='"  + row.dataIndex + "'>edit</i>"
                +  "<span style='color: red' class='material-icons' id='"  + row.dataIndex + "'>delete</span>";
            },
        }]
    });

    document.querySelectorAll('span').forEach((span)=>{
      span.addEventListener('click', deleteItem)
    });

    document.querySelectorAll('i').forEach((italics)=>{
      italics.addEventListener('click', editItem)
    })
  });
  const submit = async () => {
    try {
      //check if feilds are empty

      //create formdata and assign value to it
      let form = new FormData();
      form.append("athlete", JSON.stringify(athlete));
      console.log(athlete);
      let result = await axios.post("api/athlete", form);
      if (result) {
        let done = await win.Swal.fire({
          icon: "success",
          title: "ok",
          text: "athlete created successfully...",
        });
        if (done) {
          location.reload();
        }
      }

      // send request to server

      //
    } catch (error) {
      console.log(error);
      win.Swal.fire({
        icon: "error",
        title: "error",
        text: "something went wrong please contact support",
      });
      
    }
  };
  const update = async () => {
    try {
      //check if feilds are empty

      //create formdata and assign value to it
      let form = new FormData();
      form.append("athlete", JSON.stringify(editAthlete));
      console.log(editAthlete);
      let result = await axios.put("api/athlete2", form);
      if (result) {
        let done = await win.Swal.fire({
          icon: "success",
          title: "ok",
          text: "athlete updated successfully...",
        });
        if (done) {
          location.reload();
        }
      }

      // send request to server

      //
    } catch (error) {
      console.log(error);
      win.Swal.fire({
        icon: "error",
        title: "error",
        text: "something went wrong please contact support",
      });
      
    }
  };
  const submitRecord = async () => {
     try {
      console.log(files);
      if(files.length == 1){
          let form = new FormData();
          form.append('excel', files[0]);
          let response = await axios.put(`api/athlete`, form);
          if (response) {
        let done = await win.Swal.fire({
          icon: "success",
          title: "ok",
          text: "athletes created successfully...",
        });
        if (done) {
          location.reload();
        }
      }
      }
     } catch (error) {
      console.log(error);
      win.Swal.fire({
        icon: "error",
        title: "error",
        text: "something went wrong please contact support",
      });
     }
  }
</script>

<svelte:head>
  <title>Manage athlete</title>
</svelte:head>

<Sidebar {active} />
<main
  class="main-content position-relative max-height-vh-100 h-100 border-radius-lg "
>
  <Nav />
  <div class="container-fluid py-4">
      <div class="row">
          <div class="col-12">
              <label for="float-end">import excel</label>
              <input on:blur="{submitRecord}" bind:files class="btn btn-primary float-end" type="file" name="" id="">
          </div>
      </div>
    <div class="row">
      <div class="col-12 card">
       <div class="table-responsive">
        <table class="table table-flush" id="myTable">
            <thead class="thead-light">
                <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">s/n</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">first name</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">last name</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">other names</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">category</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">club/state</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">flag</th>

                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">actions</th>
                  </tr>
 
            </thead>
            <tbody>
              {#each athletes as ath, i}
                <tr>
                    <td class="text-sm font-weight-normal">{i + 1}</td>
                  <td class="text-sm font-weight-normal">{ath.first_name}</td>
                  <td class="text-sm font-weight-normal">{ath.last_name}</td>
                  <td class="text-sm font-weight-normal">{ath.middle_name}</td>
                  <td class="text-sm font-weight-normal">{ath.category.category_name}</td>
                  <td class="text-sm font-weight-normal">{ath.club.club_name}</td>
                  <td class="text-sm font-weight-normal"><img style="width: 50px" src="{ath.club.flag}" alt=""></td>
                  <td class="text-sm font-weight-normal"></td>

                </tr>
              {/each}
            </tbody>
          </table>
       </div>
      </div>
    </div>
  </div>
</main>

<div class="fixed-plugin">
  <!-- svelte-ignore a11y-missing-attribute -->
  <a
    data-bs-toggle="offcanvas"
    data-bs-target="#athleteCanvas"
    aria-controls="athleteCanvas"
    class="fixed-plugin-button text-dark position-fixed px-3 py-2"
  >
    <i class="material-icons py-2">add</i>
  </a>
</div>
<div
  style="background-color: black; color: white;"
  class="offcanvas offcanvas-start"
  tabindex="-1"
  id="athleteCanvas"
  aria-labelledby="athleteCanvasLabel"
>
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="athleteCanvasLabel">add athlete</h5>
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
          <label for="firstname" class="form-label">first Name</label>
          <input
            bind:value={athlete.first_name}
            required
            type="text"
            class="form-control"
            id="firstname"
            placeholder="enter first name"
          />
        </div>
      </div>
      <div class="col-12 mb-2">
        <div class="form-group">
          <label for="firstname" class="form-label">Last Name</label>
          <input
            bind:value={athlete.last_name}
            required
            type="text"
            class="form-control"
            id="last"
            placeholder="enter last name"
          />
        </div>
      </div>
      <div class="col-12 mb-2">
        <div class="form-group">
          <label for="other" class="form-label">Other Name</label>
          <input
            bind:value={athlete.middle_name}
            type="text"
            class="form-control"
            id="other"
            placeholder="enter other name"
          />
        </div>
      </div>
      <div class="col-12 mb-2">
        <div class="form-group">
          <label for="">category</label>
          <select
            bind:value={athlete.category_id}
            required
            name=""
            class="form-control"
            id="category"
          >
            {#each categories as category}
              <option value={category.id}>{category.category_name}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="col-12 mb-2">
        <div class="form-group">
          <label for="club">club/state</label>
          <select
            bind:value={athlete.state_id}
            required
            name=""
            class="form-control"
            id="club"
          >
            {#each clubs as club}
              <option value={club.id}>{club.club_name}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="col-12 mb-2">
        <input value="submit" class="btn btn-primary" type="submit" />
      </div>
    </form>
  </div>
</div>


<div
  style="background-color: white; color: black;"
  class="offcanvas offcanvas-start"
  tabindex="-1"
  id="editCanvas"
  aria-labelledby="editCanvasLabel"
>
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="editCanvasLabel">Edit Athlete</h5>
    <button
      type="button"
      class="btn-close text-reset"
      data-bs-dismiss="offcanvas"
      aria-label="Close"><i class="material-icons py-2">times</i></button
    >
  </div>
  <div class="offcanvas-body">
    <form on:submit|preventDefault={update} class="row">
      <div class="col-12 mb-2">
        <div class="form-group">
          <label for="firstname" class="form-label">first Name</label>
          <input
            bind:value={editAthlete.first_name}
            required
            type="text"
            class="form-control"
            id="firstname"
            placeholder="enter first name"
          />
        </div>
      </div>
      <div class="col-12 mb-2">
        <div class="form-group">
          <label for="firstname" class="form-label">Last Name</label>
          <input
            bind:value={editAthlete.last_name}
            required
            type="text"
            class="form-control"
            id="last"
            placeholder="enter last name"
          />
        </div>
      </div>
      <div class="col-12 mb-2">
        <div class="form-group">
          <label for="other" class="form-label">Other Name</label>
          <input
            bind:value={editAthlete.middle_name}
            type="text"
            class="form-control"
            id="other"
            placeholder="enter other name"
          />
        </div>
      </div>
      <div class="col-12 mb-2">
        <div class="form-group">
          <label for="">category</label>
          <select
            bind:value={editAthlete.category_id}
            required
            name=""
            class="form-control"
            id="category"
          >
            {#each categories as category}
              <option selected={editAthlete.category.id == category.id} value={category.id}>{category.category_name}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="col-12 mb-2">
        <div class="form-group">
          <label for="club">club/state</label>
          <select
            bind:value={editAthlete.state_id}
            required
            name=""
            class="form-control"
            id="club"
          >
            {#each clubs as club}
              <option value={club.id}>{club.club_name}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="col-12 mb-2">
        <input value="submit" class="btn btn-primary" type="submit" />
      </div>
    </form>
  </div>
</div>

<style>
  .form-control {
    border: 1px solid gainsboro;
    padding-left: 5px;
  }
</style>
