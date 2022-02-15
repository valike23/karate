<script context="module">
  export async function preload(page) {
    const res = await this.fetch(`api/judges`);
    const judges = await res.json();
    console.log(judges);
    return { judges };
  }
</script>

<script>
  import axios from "axios";

  import Nav from "../components/Nav.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  let active = "judges";
  export let judges;
  let judge = { name: "", password: "" };
  const submit = async () => {
    try {
      if (judge.name != "" && judge.password != "") {
        let form = new FormData();
        form.append("judge", JSON.stringify(judge));
        let data = await axios.post(`api/judges`, form);
        console.log(data);
        if (data) {
          Swal.fire({
            icon: "success",
            title: "success",
            text: "judge created successfully",
          });
          judge.id = data.data.insertId;
          judges.push(judge);
          judges = judges;
          judge = { name: "", password: "" };
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "oops!!!",
        text: "OOps!!, something went wrong please contact support",
      });
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
      <div class="col-12">
        <h3>Manage Judges</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card z-index-2">
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
                    >password</th
                  >
                </tr>
              </thead>
              <tbody>
                {#each judges as judge, i}
                  <tr>
                    <td class="align-middle text-center text-black text-sm">
                      <p>{i + 1}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <p>{judge.name}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <p>{judge.password}</p>
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
<div class="fixed-plugin">
  <!-- svelte-ignore a11y-missing-attribute -->
  <a
    data-bs-toggle="offcanvas"
    data-bs-target="#judgeCanvas"
    aria-controls="judgeCanvas"
    class="fixed-plugin-button text-dark position-fixed px-3 py-2"
  >
    <i class="material-icons py-2">add</i>
  </a>
</div>
<div
  style="background-color: black; color: white;"
  class="offcanvas offcanvas-start"
  tabindex="-1"
  id="judgeCanvas"
  aria-labelledby="judgeCanvasLabel"
>
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="judgeCanvasLabel">add judge</h5>
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
          <label for="name" class="form-label">Nick Name</label>
          <input
            bind:value={judge.name}
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
          <label for="password" class="form-label">password</label>
          <input
            bind:value={judge.password}
            type="text"
            class="form-control"
            id="password"
            placeholder="enter password"
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
