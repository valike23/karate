<script context="module">
  export async function preload(page) {
    const res = await this.fetch(`api/pools`, { method: "PATCH" });
    const res2 = await this.fetch(`api/kata`);
    const res3 = await this.fetch(`api/competition?id=2`);
    const katas = await res2.json();
    const pools = await res.json();
    const competition = await res3.json();
    console.log('the competition should be working now',pools);
    return { pools, katas, competition };
  }
</script>

<script lang="ts">
  import axios from "axios";

  var _ = require("lodash");
  import { onMount } from "svelte";
let pause = false;
  import Nav from "../components/Nav.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import type {
    Iathlete,
    Icompetition,
    IjudgePool,
    Ikata,
    Ipool,
  } from "../model/application";
  let active = "control";
  export let pools: Ipool[], katas: Ikata[],competition: Icompetition;
  let poolAthletes: Iathlete[] = [];
  let kata = "";
  let win, modal;
  let closeModal = false;
  let totalTech = 0;
  let totalAth = 0;
  $: result = totalAth * 0.3 + totalTech * 0.7;
  let socket;
  let nextActivePool =
    pools.find((p) => {
      return p.active_time;
    }) || pools[0];
  let activePool: Ipool = {};
  let isActve = false;
  let judgesResult: IjudgePool[] = [];
  let activeAthlete: Iathlete = {};
  let nextAthlete: Iathlete = {};
  const assignKata = async () => {
    try {
      let data = await axios.put(
        `api/pool_athlete?pool=${activePool.id}&kata=${kata}&athlete=${activeAthlete.id}`
      );
      if (data.data) {
        socket.emit("display athlete", { kata, activeAthlete });
        let res = await win.Swal.fire({
          icon: "success",
          title: "set athlete",
          text: "the current athlete kata have been set, you can start the competition anytime you like",
        });
        if (res) {
          closeModal = true;
          isActve = true;
        }
      }
    } catch (error) {
      win.Swal.fire({
        icon: "error",
        title: "failed",
        text: "failed to set kata",
      });
    }
  };
  const start = async () => {
    activePool = nextActivePool;
    let display = {
      screen: "pool",
      pool: nextActivePool,
    };
try {
  nextActivePool = {};
 pools.forEach((p,i)=>{
  if(p.id == activePool.id){
    pools[i].active_time = new Date();
  }
  else{
    if(pools[i].active_time == null){
      nextActivePool = pools[i];
    }
  }
 })
} catch (error) {
  
}
    socket.emit("show pool", display);
    let poolath = await axios.get(`api/pool_athlete?id=${activePool.id}`);
    console.log(poolath.data);
    poolAthletes = poolath.data.athletes;
    let count = 0;
    for (let index = 0; index < poolAthletes.length; index++) {
      const element = poolAthletes[index];
      if (element.active_time == null) {
        if (count == 0) {
          activeAthlete = element;
          count = count + 1;
        } else {
          nextAthlete = element;
          break;
        }
      }
    }
  };
  let showJudges = false;
  onMount(() => {
    win = window;
    socket = win.io("/display");
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("judge scores", (data) => {
      console.log(data);
      judgesResult.push(data);
      judgesResult = judgesResult;
      showJudges = true;
    });
  });

  const upload =async () =>{
    //upload score
    socket.emit('result', result);
  try {
    let data = await axios.put(
        `api/pool_athlete?pool=${activePool.id}&status=result&athlete=${activeAthlete.id}&result=${result}`);
        if (data) {
        win.Swal.fire({
          icon: "success",
          text: "Athlete has began performing",
          title: "success",
        }).then(()=>{
          judgesResult = [];
          result = 0.0;
          totalAth = 0.0;
          totalTech = 0.0;
        });
      }
  } catch (error) {
    
  }
}
const nextAthleteBtn =()=>{
  if(nextAthlete.id){
    activeAthlete = nextAthlete;
    nextAthlete = {};
    for (let index = 0; index < poolAthletes.length; index++) {
      const element = poolAthletes[index];
      if(element.active_time){
        nextAthlete = element;
        break;
      }
    }
  }
  else{
    win.Swal.fire({
          icon: "info",
          text: "You have come to the end of the pool you can now end the pool if you will.",
          title: "Notice",
        })
  }
}

  const compute = () => {
    let cut = judgesResult.length == 5 ? 1 : 2;
    console.log(cut);

    let temp = judgesResult.sort((a, b) => {
      return a.athletic_performance - b.athletic_performance;
    });
    console.log(temp, judgesResult);
    if (cut == 1) {
      temp[0].ath_status = "cancel";
      temp[4].ath_status = "cancel";
      totalAth = totalAth + temp[1].athletic_performance;
      totalAth = totalAth + temp[2].athletic_performance;
      totalAth = totalAth + temp[3].athletic_performance;
      totalAth = totalAth;
    }
    if (cut == 2) {
      temp[0].ath_status = "cancel";
      temp[1].ath_status = "cancel";
      totalAth = totalAth + temp[2].athletic_performance;
      totalAth = totalAth + temp[3].athletic_performance;
      totalAth = totalAth + temp[4].athletic_performance;
      totalAth = totalAth;
    }
    console.log(temp, judgesResult, totalAth);

    let temp2 = judgesResult.sort((a, b) => {
      return a.technical_performance - b.technical_performance;
    });
    console.log(temp2, judgesResult);
    if (cut == 1) {
      temp2[0].tech_status = "cancel";
      temp2[4].tech_status = "cancel";
      totalTech = totalTech + temp[1].technical_performance;
      totalTech = totalTech + temp[2].technical_performance;
      totalTech = totalTech + temp[3].technical_performance;
      totalTech = totalTech;
    }
    if (cut == 2) {
      temp2[0].tech_status = "cancel";
      temp2[1].tech_status = "cancel";
      temp2[5].tech_status = "cancel";
      temp2[6].tech_status = "cancel";
      totalTech = totalTech + temp[2].technical_performance;
      totalTech = totalTech + temp[3].technical_performance;
      totalTech = totalTech + temp[4].technical_performance;
      totalTech = totalTech;
    }
    console.log(temp2, judgesResult, totalTech);
  };

  const openKataModal = () => {
    modal = new win.bootstrap.Modal(document.getElementById("kata"), {
      keyboard: false,
      backdrop: "static",
    }).show();
    closeModal = true;
  };
  const startKata = async () => {
    try {
      
      let data = await axios.put(
        `api/pool_athlete?pool=${activePool.id}&status=start&athlete=${activeAthlete.id}`
      );
      if (data) {
        win.Swal.fire({
          icon: "success",
          text: "Athlete has began performing",
          title: "success",
        }).then(()=>{
          pause = true;
         let index = poolAthletes.findIndex((e)=>{
            return e.id == activeAthlete.id
          });
          poolAthletes[index].active_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        });
      }
    } catch (error) {
      win.Swal.fire({
        icon: "error",
        text: "Something went wrong. Please you do well to contact support",
        title: "Error",
      });
    }
  };
  const stopKata = async () => {
    try {
      let data = await axios.put(
        `api/pool_athlete?pool=${activePool.id}&status=end&athlete=${activeAthlete.id}`
      );
      if (data) {
        win.Swal.fire({
          icon: "success",
          text: "Athlete has stopped performing",
          title: "success",
        }).then(() => {
          socket.emit("start judge", {
            athlete: activeAthlete,
            pool: activePool,
          });
        });
      }
    } catch (error) {
      win.Swal.fire({
        icon: "error",
        text: "Something went wrong. Please you do well to contact support",
        title: "Error",
      });
    }
  };
  const stopPool = ()=>{
    if(nextActivePool.id){
      activePool = {};
    }
    else{
      win.Swal.fire({
          icon: "info",
          text: "You have finished all the pools in this category",
          title: "End",
        })
    }
  }
</script>

<Sidebar {active} />
<main
  class="main-content position-relative max-height-vh-100 h-100 border-radius-lg "
>
  <Nav />

  <div class="container-fluid py-4">
    <div class="row mb-5">
      <div class="col">
       <p><strong>current competition: </strong>:{competition.competition_name} </p> 
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-6 col-sm-3">
        <div class="form-group">
          <label for="">active pool</label>
          <input
            class="form-control"
            bind:value={activePool.pool_name}
            type="text"
            disabled
          />
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="form-group">
          <label for="">active athlete</label>
          <input
            class="form-control"
            type="text"
            value={activeAthlete.first_name + " " + activeAthlete.last_name}
            disabled
          />
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="form-group">
          <label for="">next athlete</label>
          <input
            class="form-control"
            type="text"
            value={nextAthlete.first_name + " " + nextAthlete.last_name}
            disabled
          />
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="form-group">
          <label for="">next pool</label>
          <input
            bind:value={nextActivePool.pool_name}
            class="form-control"
            type="text"
            disabled
          />
        </div>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-12 col-sm-3">
        <div on:click={start} class="button btn bg-primary">start pool</div>
      </div>
      <div class="col-12 col-sm-3">
        <div on:click="{nextAthleteBtn}" class="button btn bg-secondary ">Next Athlete</div>
      </div>
      <div class="col-12 col-sm-3">
        <div class="button btn bg-secondary " on:click={openKataModal}>
          Start Active Athlete
        </div>
      </div>
      <div class="col-12 col-sm-3">
        <div on:click="{stopPool}" class="button btn bg-primary ">End Pool</div>
      </div>
    </div>

    {#if closeModal}
      <div class="row card mt-5">
        <div class="col-2"><img src="" alt="" /></div>
        <div class="col-4">
          {activeAthlete.first_name + " " + activeAthlete.last_name}
        </div>
        <div class="col-4">
          <button on:click={startKata} class="btn btn-success">start</button>
          <button on:click={stopKata} class="btn btn-primary">Stop</button>
        </div>
      </div>
    {/if}
   
      <div class="ml-2 row mt-5">
        <div
          class="py-5 col-2"
          style="height: 150px; background-color: red; justify-content: center; align-items: center; text-align: center;"
        >
          <span class="font-weight-bolder text-white" style="font-size: 40px;"
            >{result}</span
          >
        </div>
        <div class="col-4">

          <!-- svelte-ignore a11y-missing-content -->
          <h3 class="text-uppercase font-weight-bolder" />
          <br />
          <!-- svelte-ignore a11y-missing-content -->
          <h4 />
          <br />
          <!-- svelte-ignore a11y-missing-content -->
          <h4 />
        </div>
        <!-- svelte-ignore a11y-missing-content -->
        <div class="text-right col-6"><h4 style="color: red;" ></h4></div>
      </div>
      <div class="m-0 row">
        <div class="w-100 col-12">
          <table
            class="table table-bordered table-responsive font-size-17"
            width="100%"
          >
            <thead class="thead-dark"
              ><tr
                ><th />{#each judgesResult as judge, i}
                  <th>{"judge" + (i + 1)}</th>
                {/each}<th>TOTAL</th><th>FACTOR</th><th>RESULT</th></tr
              ></thead
            ><tbody
              ><tr
                ><td class="font-weight-bolder">TECH</td
                >{#each judgesResult as judge}
                  <td>{judge.technical_performance}</td>
                {/each}<td>{totalTech.toFixed(2)}</td><td>0.7</td><td
                  >{(totalTech * 0.7).toFixed(2)}</td
                ></tr
              ><tr
                ><td class="font-weight-bolder">ATH</td>
                {#each judgesResult as judge}
                  <td>{judge.athletic_performance}</td>
                {/each}
                <td>{totalAth.toFixed(2)}</td><td>0.3</td><td
                  >{(totalAth * 0.3).toFixed(2)}</td
                ></tr
              ><tr style="height: 75px;">
                {#each judgesResult as judge}
                  <td> &nbsp;</td>
                {/each}
                <td style="background-color: red; color: white;"
                  >{result.toFixed(2)}</td
                ></tr
              ></tbody
            >
          </table>
        </div>
      </div>
      <br />
      <div class="text-center justify-content-center row">
        <div class="col-4">
          <button
            type="button"
            on:click={compute}
            class="btn btn-danger btn-block btn btn-secondary"
            style="height: 50px;">Compute</button
          >
          <button
          type="button"
          on:click={upload}
          class="btn btn-danger btn-block btn btn-primary"
          style="height: 50px;">Upload Result</button
        >
        </div>
      </div>
      <br />
      <br />
   
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
            <select bind:value={kata} required class="form-control">
              <option value="">Pick a kata the athlete will perform</option>
              {#each katas as item}
                <option value={item.kata_name}>{item.kata_name}</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="form-group">
            <label for="name">Athlete </label>
            <input
              value={activeAthlete.first_name + " " + activeAthlete.last_name}
              required
              class="form-control"
              type="text"
            />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        {#if closeModal}
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
        {/if}
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
