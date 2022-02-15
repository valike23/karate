<script>
import axios from "axios";

  import { onMount } from "svelte";
  let socket;
  let pool = {};
  let athletes = [];
  let show = '';
  onMount(() => {
    console.log(window);
    socket = io("/display");
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on('update',(data)=>{
        
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
{:else if  show = 'athlete'}
   <p></p>
{:else}
   <p>no display yet</p>
{/if}
