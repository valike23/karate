<script>
import axios from "axios";

  import { onMount } from "svelte";
  let socket;
  let pool = {};
  let athletes = [];
  let athlete = {};
  let show = '';
  onMount(() => {
    console.log(window);
    socket = io("/display");
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on('update',(data)=>{
        
    })
    socket.on('display athlete',(data)=>{
      console.log('display');
      show = 'athlete';
      console.log(data);
      athlete = data.athlete;
    })
    socket.on('active pool', async (mypool)=>{
      show ="pool";
      pool = mypool;
      try {
        athletes = (await (await axios.get(`api/pool_athlete?id=${mypool.id}`)).data).athletes;
        console.log(athletes);
        athletes = athletes;
      } catch (error) {
        
      }
    })
  });
</script>

{#if show == 'pool'}
  <div >
<h3>Current Pool {pool.pool_name}</h3>
  </div>
  <div class="row p-4">
    <div class="col-12 ">
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
              {#each athletes as a, i}
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
  </div>
{:else if  show == 'athlete'}
  <div class="container box card p-3" style="background-color: black">
    <div class="row">
      <div class="col-12">
        <p class="category">male Individual Kata</p>
      </div>
      <div class="col-12">
        <p class="category">{athlete.first_name + athlete.last_name}</p>
      </div>
      <div class="col-12">
        <p class="category">Hong Kong</p>
      </div>
    
    </div>

  </div>
{:else}
   <p>no display yet</p>
{/if}

<style>
  .box{
    margin-top: 10%;
   
  }
  .category {
    font-size: 2.0 rem;
    color: white;
    font-weight: 600;
  }
</style>
