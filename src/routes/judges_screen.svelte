<script lang="ts">
  import axios from "axios";

  import { onMount } from "svelte";
  import type { Ijudge, IjudgePool, Ipool } from "../model/application";

  let athleticPerformance = 7.0;
  let technicalPerformance = 7.0;
  let judge: Ijudge = {};
  let socket;
  let screen = "";
  let pool: Ipool = {};
  let disqualified = async () => {
    let res = confirm("do you want to disqualify this athlete?");
    try {
      if (res) {
      let judgeResult: IjudgePool = {
        athletic_performance: 0,
        athlete_id: athlete.id,
        technical_performance: 0,
        judge_id: judge.id,
        pool_id: pool.id,
      };
      let form = new FormData();
      form.append("judge", JSON.stringify(judgeResult));
      let data = await (await axios.post(`api/judge_pool`, form)).data;
      if (data) {
        
        let resd = await win.Swal.fire({
          icon: "success",
          title: "Success",
          text: "scores uploaded successfully",
        });
        if (resd) {
          athleticPerformance = 7.0;
          technicalPerformance = 7.0;
          screen = "";
          socket.emit('judge scores', judgeResult);
        }
      }
    }
    } catch (error) {
      console.error(error);
      win.Swal.fire({
        icon: "error",
        title: "oops!!!",
        text: "something went wrong...., please contact support.",
      });
    }
  };
  let submitScore = async () => {
    let res = confirm("do you want to upload this athlete's score?");
    try {
      if (res) {
      let judgeResult: IjudgePool = {
        athletic_performance: athleticPerformance,
        athlete_id: athlete.id,
        technical_performance: technicalPerformance ,
        judge_id: judge.id,
        pool_id: pool.id,
      };
      let form = new FormData();
      form.append("judge", JSON.stringify(judgeResult));
      let data = await (await axios.post(`api/judge_pool`, form)).data;
      if (data) {
        let resd = await win.Swal.fire({
          icon: "success",
          title: "Success",
          text: "scores uploaded successfully",
        });
        if (resd) {

          socket.emit('judge scores', judgeResult);
          athleticPerformance = 7.0;
          technicalPerformance = 7.0;
          screen = "";
        }
      }
    }
    } catch (error) {
      console.error(error);
      win.Swal.fire({
        icon: "error",
        title: "oops!!!",
        text: "something went wrong...., please contact support.",
      });
    }
  };
  let athlete;
  let win;
  onMount(() => {
    win = window;
    socket = win.io("/display");
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("start judge", async (data) => {
      athlete = data.athlete;
      athlete.club = {};
      pool = data.pool;
      screen = "judge";
      try {
        let response = await axios.get(
          `api/athlete?id=${athlete.id}&status=single`
        );
        console.log(data);
        athlete = response.data;
      } catch (error) {}
    });
    let userString = sessionStorage.getItem("kataUser");
    if (userString == undefined) {
       new win.bootstrap.Modal(document.getElementById("myModal"), {
        keyboard: false,
        backdrop: "static",
      }).show();
    } else {
      judge = JSON.parse(userString);
    }
  });
  const login = async () => {
    try {
      let response = await axios.put(
        `api/judges?name=${judge.name}&password=${judge.password}`
      );
      if (response.data.result == 1) {
        let res = await win.Swal.fire({
          icon: "success",
          title: "Success",
          text: "login was successful",
        });
        if (res) {
          sessionStorage.setItem(
            "kataUser",
            JSON.stringify(response.data.data)
          );
          location.reload();
        }
      } else {
        win.Swal.fire({
          icon: "error",
          title: "error",
          text: "user name or password incorrect",
        });
      }
    } catch (error) {
      console.error(error);
      win.Swal.fire({
        icon: "error",
        title: "oops!!!",
        text: "something went wrong...., please contact support.",
      });
    }
  };


</script>

<div class="container-fluid">
  {#if screen == "judge"}
    <div class="container" style="background-color: black;">
      <div class="p-3 row">
        <div class="col-5">
          <div
            class="justify-content-center text-center p-4 font-weight-bolder"
            style="background-color: yellow; color: red;"
          >
            <h1 style="font-size: 36px; font-weight: 800;">{judge.name}</h1>
          </div>
        </div>
        <div
          class="justify-content-end text-center pt-4 text-white font-weight-bolder col-5"
        >
          <span class="font-size-18">0.7 TECHNICAL</span>&nbsp;&nbsp;<span
            class="font-size-18">0.3 ATHLETIC</span
          >
        </div>
        <div class="col-2">
          <button class="btn btn-warning btn-block btn btn-secondary"
            >Logout</button
          >
        </div>
      </div>
      <br />
      <div class="text-center justify-content-center row">
        <div class="col-4">
          <h1 class="text-uppercase" style="color: red;" >{pool.pool_name}</h1>
        </div>
      </div>
      <br />
      <div class="p-4 row">
        <div class="col-4">
          <div class="pl-4" style="border-left: 1px solid red;">
            <h1>{athlete.first_name + " " + athlete.last_name}</h1>
          </div>
        </div>
        <div class="col-4">
          <img
            class="img-fluid"
            src={athlete.club.flag}
            alt="state-flag"
            width="500"
          />
        </div>
        <div class="col-4">
          <div class="pr-4 text-right" style="border-right: 1px solid red;">
            <h1 />
          </div>
        </div>
      </div>
      <br />
      <div class="mx-5 row">
        <div class="p-4 col">
          <div class="row">
            <div class="p-2 col-12 col-sm-6" style="border-right: 1px solid red;">
              <label
                class="font-weight-bold h1"
                for="tech"
                style="color: white;">TECH 0</label
              >&nbsp;&nbsp;<input
                min="0.0"
                max="10.0"
                step="0.2"
                id="technique"
                name="technique"
                placeholder="0.0"
                class="form-control font-weight-bold"
                type="number"
                bind:value={technicalPerformance}
                style="border: 1px solid red; background-color: transparent; font-size: 28px; color: white;"
              />
            </div>
            <div class="p-2 text-right col-12 col-sm-6">
              <label
                class="font-weight-bold h1 text-right"
                for="tech"
                style="color: white;"
                >ATH
              </label>&nbsp;&nbsp;<input
                min="0.0"
                max="10.0"
                step="0.2"
                id="athletics"
                name="athletics"
                placeholder="0.0"
                class="form-control font-weight-bold text-right"
                type="number"
                bind:value={athleticPerformance}
                style="border: 1px solid red; background-color: transparent; font-size: 28px; color: white;"
              />
            </div>
          </div>
        </div>
      </div>
      <br />
      <div class="text-center justify-content-center row">
        <div class="col-6">
          <button
            type="button"
            on:click={submitScore}
            class="btn btn-warning btn-block btn-lg btn btn-secondary"
            style="height: 70px; font-size: 18px; font-weight: 600;"
            >Submit Score</button
          >&nbsp;&nbsp;
        </div>
        <div class="float-right col-4">
          <button
            type="button"
            on:click={disqualified}
            class="btn btn-danger btn-block btn btn-secondary"
            style="height: 70px; font-size: 18px; font-weight: 600;"
            >Disqualify</button
          >
        </div>
      </div>
      <br />
    </div>
  {:else}
    <div class="container" style="background-color: black;">
      <div class="p-3 row">
        <div class="col-5">
          <div
            class="justify-content-center text-center p-4 font-weight-bolder"
            style="background-color: yellow; color: red;"
          >
            <h1 style="font-size: 36px; font-weight: 800;">{judge.name}</h1>
          </div>
        </div>
        <div
          class="justify-content-end text-center pt-4 text-white font-weight-bolder col-5"
        >
          <span class="font-size-18">0.7 TECHNICAL</span>&nbsp;&nbsp;<span
            class="font-size-18">0.3 ATHLETIC</span
          >
        </div>
        <div class="col-2">
          <button class="btn btn-warning btn-block btn btn-secondary"
            >Logout</button
          >
        </div>
      </div>
      <br />
      <div class="text-center justify-content-center row">
        <div class="col-4">
          <h1 class="text-uppercase" style="color: red;" />
        </div>
      </div>
      <br />
      <div class="p-4 row">
        <div class="col-4">
          <div class="pl-4" style="border-left: 1px solid red;"><h1 /></div>
        </div>
        <div class="col-4">
          <img
            class="img-fluid"
            src="sports.png"
            alt="state-flag"
            width="500"
          />
        </div>
        <div class="col-4">
          <div class="pr-4 text-right" style="border-right: 1px solid red;">
            <h1 />
          </div>
        </div>
      </div>
      <br />
      <div class="mx-5 row">
        <div class="p-4 col">
          <div class="row">
            <div class="p-2 col-6" style="border-right: 1px solid red;">
              <label
                class="font-weight-bold h1"
                for="tech"
                style="color: white;">TECH 0</label
              >&nbsp;&nbsp;<input
                min="0.0"
                max="10.0"
                disabled
                step="0.2"
                id="technique"
                name="technique"
                placeholder="0.0"
                class="form-control font-weight-bold"
                type="number"
                value="0"
                style="border: 1px solid red; background-color: transparent; font-size: 28px; color: white;"
              />
            </div>
            <div class="p-2 text-right col-6">
              <label
                class="font-weight-bold h1 text-right"
                for="tech"
                style="color: white;"
                >ATH
              </label>&nbsp;&nbsp;<input
                min="0.0"
                max="10.0"
                step="0.2"
                disabled
                id="athletics"
                name="athletics"
                placeholder="0.0"
                class="form-control font-weight-bold text-right"
                type="number"
                value="0"
                style="border: 1px solid red; background-color: transparent; font-size: 28px; color: white;"
              />
            </div>
          </div>
        </div>
      </div>
      <br />
      <div class="text-center justify-content-center row">
        <div class="col-6">
          <button
            type="button"
            class="btn btn-warning btn-block btn-lg btn btn-secondary"
            style="height: 70px; font-size: 18px; font-weight: 600;"
            >Submit Score</button
          >&nbsp;&nbsp;
        </div>
        <div class="float-right col-4">
          <button
            type="button"
            class="btn btn-danger btn-block btn btn-secondary"
            style="height: 70px; font-size: 18px; font-weight: 600;"
            >Disqualify</button
          >
        </div>
      </div>
      <br />
    </div>
  {/if}
</div>

<div id="myModal" class="modal" tabindex="-1">
  <div class="modal-dialog">
    <form on:submit|preventDefault={login} class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Login Judge</h5>
      </div>
      <div class="modal-body">
        <div>Please login to continue</div>
        <div class="col-12 col-sm-6">
          <div class="form-group">
            <label for="name">Nick Name</label>
            <input
              bind:value={judge.name}
              required
              class="form-control"
              type="text"
            />
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="form-group">
            <label for="name">password </label>
            <input
              bind:value={judge.password}
              required
              class="form-control"
              type="password"
            />
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
  .bold-text {
    margin-top: auto;
    font-size: 1.3 rem;
    font-weight: 600;
  }
  .form-control {
    border: 1px solid gray;
  }
  .input {
    width: 90%;
    height: 70px;
    font-size: 20px;
    font-weight: 700;
    border-radius: 12px;
    border: 2px solid blue;
    text-align: center;
  }

  p {
    font-size: 1.2rem;
    font-weight: 500;
  }
  @media only screen and (max-width: 600px) {
    .input-container {
      width: 80vw;
      margin: auto;
    }
  }

  /* Small devices (portrait tablets and large phones, 600px and up) */
  @media only screen and (min-width: 600px) {
    .input-container {
      width: 70vw;
      margin: auto;
    }
  }

  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (min-width: 768px) {
    .input-container {
      width: 60vw;
      margin: auto;
    }
  }

  /* Large devices (laptops/desktops, 992px and up) */
  @media only screen and (min-width: 992px) {
    .input-container {
      width: 50vw;
      margin: auto;
    }
  }

  /* Extra large devices (large laptops and desktops, 1200px and up) */
  @media only screen and (min-width: 1200px) {
    .input-container {
      width: 50vw;
      margin: auto;
    }
  }
</style>
