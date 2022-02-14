<script context="module">
  export async function preload(page) {
    console.log(page.query);
    let query = page.query;
    const res2 = await this.fetch(
      `api/athlete?name=category_id&value=${query.id}`,
      { method: "PATCH" }
    );
    const categoryId = query.id;
    const res = await this.fetch(`api/pools?id=${query.id}`);
    const athletes = await res2.json();
    const pools = await res.json();
    return { athletes, pools, categoryId };
  }
</script>

<script lang="ts">
  import axios from "axios";
  import { onMount } from "svelte";

  import Nav from "../components/Nav.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import type { Iathlete, Ipool, IpoolAthlete } from "../model/application";

  export let athletes: Iathlete[], pools: Ipool[], categoryId;
  let generatePools = false;
  let win: any = {};
  let active = "category";
  let group: Ipool = {};
  let groups: Ipool[] = [];
  if (pools.length == 0) {
    generatePools = true;
    // if (athletes.length <= 3) {
    // } else if (athletes.length == 4) {
    // } else if (athletes.length >= 5 && athletes.length <= 10) {
    // } else if (athletes.length >= 11 && athletes.length <= 24) {
    // } else if (athletes.length >= 25 && athletes.length <= 48) {
    // } else if (athletes.length >= 49 && athletes.length <= 96) {
    // } else if (athletes.length >= 97 && athletes.length <= 96) {
    // } else if (athletes.length >= 193) {
    // }
  } 

  onMount(()=>{
    console.log(pools);
    console.log(groups);
    pools.forEach( (pool,i) => {
      let group: Ipool = {};
      group.athletes = [];
      axios.get(`api/pool_athlete?id=${pool.id}`).then((data)=>{
        console.log('the kid called the boss thinking he is boss:,',data);
      
      group.athletes = data.data.athletes;
      groups.push(group);
      groups = groups;
      console.log('the groups is going down here:',groups);
      });
     
    });
    
  })

  const submit = async () => {
    try {
      let form = new FormData();
      group.category_id = categoryId;
      form.append("pool", JSON.stringify(group));
      let data = await axios.post("api/pools", form);
      if (data.data) {
        console.log(data.data);
        group.id = data.data.insertId;
        group.athletes = [];
        groups.push(group);
        group = {};
        groups = groups;
      }
    } catch (error) {}
  };
  const assign = (group: Ipool, athlete: Iathlete) => {
    console.log(group, athlete);

    groups.forEach((g, i) => {
      if (g.id == group.id) groups[i].athletes.push(athlete);
    });
    console.log(athletes);
    athletes = athletes.filter((a) => {
      let data = a.id != athlete.id;
      console.log(data);
      return data;
    });
    athletes = athletes;
    groups = groups;
    //console.log(groups);
  };

  const reassign = (group: Ipool, athlete: Iathlete) => {
    group.athletes.splice(
      group.athletes.findIndex((a) => {
        return a.id == a.id;
      }),
      1
    );
    groups.forEach((e, i) => {
      if (group.id == e.id) groups[i] = group;
    });
    athletes.push(athlete);
    groups = groups;
    athletes = athletes;
    console.log(athletes);
  };
  const upload = async () => {
    win = window;
    let confirm = window.confirm("are you sure yoou want to upload the pools");
    if (confirm) {
      try {
        let poolAthletes: IpoolAthlete[] = [];
        groups.forEach((e) => {
          e.athletes.forEach((f) => {
            let poolAthlete: IpoolAthlete = {};
            poolAthlete.pool_id = e.id;
            poolAthlete.athlete_id = f.id;
            poolAthletes.push(poolAthlete);
          });
        });
        console.log(poolAthletes);
        let form = new FormData();
        form.append("pool", JSON.stringify(poolAthletes));
        let data = await axios.post(`api/pool_athlete`, form);
        if (data.data) {
          let response = await win.Swal.fire({
            icon: "success",
            text: "pools populated successfully...",
            title: "success",
          });
          if (response) location.reload();
        }
      } catch (error) {
        console.log(error);
        win.Swal.fire({
          icon: "error",
          text: "oops something ..., please contact support.",
          title: "oops",
          footer: `<a href="tel:07040206876" >click to call support</a><br/> <a href="mailto:ludike23@gmail.com">click to mail support</a>`,
        });
      }
    }
  };
</script>

<Sidebar {active} />
<main
  class="main-content position-relative max-height-vh-100 h-100 border-radius-lg "
>
  <Nav />

  <div class="container-fluid py-4">
    <div class="row">
      <h3>Manage Pools</h3>
    </div>
    {#if generatePools}
      <div class="row mb-5">
        {#each groups as group}
          <div class="col-12 col-md-6 col-xl-4">
            <div class="card pl-2 pr-2">
              <div>{group.pool_name}</div>
              <table class="table ml-2 mr-2">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th colspan="2" scope="col">name</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {#each group.athletes as athlete, i}
                    <tr>
                      <th scope="col">{i + 1}</th>
                      <td colspan="2"
                        >{athlete.first_name + " " + athlete.last_name}</td
                      >
                      <td
                        ><span
                          on:click={() => {
                            reassign(group, athlete);
                          }}
                          style="color: red"
                          class="material-icons">delete</span
                        ></td
                      >
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/each}
        {#if groups.length > 0}
          <div class="row mt-5">
            <div class="col-12 mt-3 pt-2">
              <button on:click={upload} class="btn btn-success"
                >upload pool</button
              >
            </div>
          </div>
        {/if}
      </div>

      <div class="row">
        <div class="card">
          <div><p><strong>Athletes</strong></p></div>

          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">state</th>
                <th scope="col">action</th>
              </tr>
            </thead>
            <tbody>
              {#each athletes as athlete, i}
                <tr>
                  <th scope="row">{i + 1}</th>
                  <td>{athlete.first_name + " " + athlete.last_name}</td>
                  <td>{athlete.club.club_name}</td>
                  <td
                    ><div class="dropdown">
                      <button
                        class="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        assign to pool
                      </button>
                      <ul
                        class="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        {#each groups as group}
                          <!-- svelte-ignore a11y-invalid-attribute -->
                          <li
                            on:click={() => {
                              assign(group, athlete);
                            }}
                          >
                            <a class="dropdown-item" href="javascript:void();"
                              >{group.pool_name}</a
                            >
                          </li>
                        {/each}
                      </ul>
                    </div></td
                  >
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {:else}
      <div class="row">
        {#each groups as g}
          <div class="col-12 col-sm-6 col-md-4">
            <div class="card">
              <div class="table-responsive">
                <table class="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                        >id</th
                      >
                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                        >name</th
                      >

                      <th
                        class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                        >result</th
                      >
                    </tr>
                  </thead>
                  <tbody>
                    {#each g.athletes as a, i}
                      <tr>
                        <td class="align-middle text-center text-black text-sm">
                          <p
                            >{i + 1}</p
                          >
                        </td>
                        <td class="align-middle text-center text-sm">
                          <p
                            >{a.first_name +
                              " " +
                              a.last_name}</p
                          >
                        </td>
                        <td class="align-middle text-center text-sm">
                          <p 
                            >{a.result || 0}</p
                          >
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</main>
{#if generatePools}
  <div class="fixed-plugin">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      data-bs-toggle="offcanvas"
      data-bs-target="#poolCanvas"
      aria-controls="poolCanvas"
      class="fixed-plugin-button text-dark position-fixed px-3 py-2"
    >
      <i class="material-icons py-2">add</i>
    </a>
  </div>
{/if}

<div
  style="background-color: black; color: white;"
  class="offcanvas offcanvas-start"
  tabindex="-1"
  id="poolCanvas"
  aria-labelledby="poolCanvasLabel"
>
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="poolCanvasLabel">add pool</h5>
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
          <label for="name" class="form-label">pool name</label>
          <input
            bind:value={group.pool_name}
            required
            type="text"
            class="form-control"
            id="name"
            placeholder="enter pool name"
          />
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
