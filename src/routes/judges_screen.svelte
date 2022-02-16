<script>
import axios from "axios";

  import { onMount } from "svelte";

  const submit = () => {
    console.log(athleticPerformance, technicalPerformance);
  };
  let athleticPerformance = 7.0;
  let technicalPerformance = 7.0;
  let judge = {name:""};
  let modal;
  let screen = '';
  onMount(() => {
    let userString = sessionStorage.getItem("kataUser");
    if (userString == undefined)
      modal = new bootstrap.Modal(document.getElementById("myModal"), {
        keyboard: false,
        backdrop: "static",
      }).show();
      judge = JSON.parse(userString );
  });
  const login = async () => {
    try {
      let response = await axios.put(`api/judges?name=${judge.name}&password=${judge.password}`);
      if(response.data.result == 1){
      let res = await  Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'login was successful'
        });
        if(res) {
            sessionStorage.setItem('kataUser', JSON.stringify(response.data.data));
            modal.hide();
        }
      }
      else{
        Swal.fire({
            icon: 'error',
            title: 'error',
            text: 'user name or password incorrect'
        });
      }
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'oops!!!',
            text: 'something went wrong...., please contact support.'
        });
    }
  }
</script>

<div class="container-fluid">
{#if screen =="judge"}
<div class="row mb-3">
    <div class="col-12">
      <h3>upload scores</h3>
      <h6>welcome {judge.name} we would be expecting scores for ___</h6>
    </div>
  </div>

  <div class="input-container card p-4">
    <div class="row mb-3">
      <div class="col-8"><p>Athletic Performance</p></div>
      <div class="col-4">
        <input
          class="input"
          bind:value={athleticPerformance}
          max="10"
          min="0"
          step="0.1"
          type="number"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-8"><p>Technical Performance</p></div>
      <div class="col-4">
        <input
          class="input"
          bind:value={technicalPerformance}
          max="10"
          min="0"
          step="0.1"
          type="number"
        />
      </div>
    </div>

    <div class="d-grid gap-2 mt-5">
      <button class="btn btn-primary" on:click={submit} type="button"
        >Submit</button
      >
    </div>
  </div>
{:else}
     <div class="row">
         <div class="bold-text">you do not have any current athlete</div>
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
            <input  bind:value="{judge.name}" required class="form-control" type="text" />
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="form-group">
            <label for="name">password </label>
            <input bind:value="{judge.password}" required class="form-control" type="password" />
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
