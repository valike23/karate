<script lang="ts">
    export let active;
</script>


<aside
class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3   bg-gradient-dark"
id="sidenav-main"
>
<div class="sidenav-header">
  <i
    class="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
    aria-hidden="true"
    id="iconSidenav"
  />
  <a
    class="navbar-brand m-0"
    href=" / "
    target="_blank"
  >
    <img
      src="logo.png"
      class="navbar-brand-img h-100"
      alt="main_logo"
    />
    <span class="ms-1 font-weight-bold text-white">Kata</span>
  </a>
</div>
<hr class="horizontal light mt-0 mb-2" />
<div
  class="collapse navbar-collapse  w-auto  max-height-vh-100"
  id="sidenav-collapse-main"
>
  <ul class="navbar-nav">
    <li class="nav-item">
      <a
      rel="external"
       class:active={active == 'home'} class="nav-link text-white  " class:bg-gradient-primary={active == 'home'}
        href="/"
      >
        <div
          class="text-white text-center me-2 d-flex align-items-center justify-content-center"
        >
          <i class="material-icons opacity-10">dashboard</i>
        </div>
        <span class="nav-link-text ms-1">Dashboard</span>
      </a>
    </li>
    <li class="nav-item">
      <a rel="external" class:active={active == 'competition'} class:bg-gradient-primary={active == 'competition'} class="nav-link text-white " href="/competition">
        <div
          class="text-white text-center me-2 d-flex align-items-center justify-content-center"
        >
          <i class="material-icons opacity-10">add</i>
        </div>
        <span class="nav-link-text ms-1">Events</span>
      </a>
    </li>
    <li class="nav-item">
      <a rel="external" class:active={active == 'athlete'} class:bg-gradient-primary={active == 'athlete'} class="nav-link text-white " href="/manage_athlete">
        <div
          class="text-white text-center me-2 d-flex align-items-center justify-content-center"
        >
          <i class="material-icons opacity-10">add</i>
        </div>
        <span class="nav-link-text ms-1">Entries</span>
      </a>
    </li>
    <li class="nav-item">
      <a rel="external" class:active={active == 'category'} class:bg-gradient-primary={active == 'category'} class="nav-link text-white " href="/category">
        <div
          class="text-white text-center me-2 d-flex align-items-center justify-content-center"
        >
          <i class="material-icons opacity-10">receipt_long</i>
        </div>
        <span class="nav-link-text ms-1">Pools</span>
      </a>
    </li>
    <li class="nav-item">
      <a rel="external" class:active={active == 'club'} class:bg-gradient-primary={active == 'club'} class="nav-link text-white " href="/clubs">
        <div
          class="text-white text-center me-2 d-flex align-items-center justify-content-center"
        >
          <i class="material-icons opacity-10">groups</i>
        </div>
        <span class="nav-link-text ms-1">Manage Clubs</span>
      </a>
    </li>
    <li class="nav-item">
      <a rel="external" class:active={active == 'judges'} class:bg-gradient-primary={active == 'judges'} class="nav-link text-white " href="/judges">
        <div
          class="text-white text-center me-2 d-flex align-items-center justify-content-center"
        >
          <i class="material-icons opacity-10">gavel</i>
        </div>
        <span class="nav-link-text ms-1">Manage Judges</span>
      </a>
    </li>
    <li class="nav-item">
      <a rel="external" class:active={active == 'control'} class:bg-gradient-primary={active == 'control'}  class="nav-link text-white " href="/competition_control">
        <div
          class="text-white text-center me-2 d-flex align-items-center justify-content-center"
        >
          <i class="material-icons opacity-10">gamepad</i>
        </div>
        <span class="nav-link-text ms-1">Competition Control</span>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link text-white " href="./pages/notifications.html">
        <div
          class="text-white text-center me-2 d-flex align-items-center justify-content-center"
        >
          <i class="material-icons opacity-10">notifications</i>
        </div>
        <span class="nav-link-text ms-1">Notifications</span>
      </a>
    </li>
    <li class="nav-item mt-3">
      <h6
        class="ps-4 ms-2 text-uppercase text-xs text-white font-weight-bolder opacity-8"
      >
       Extras
      </h6>
    </li>
    <li class="nav-item">
      <a rel="external" class:active={active == 'links'} class:bg-gradient-primary={active == 'links'} class="nav-link text-white " href="/links">
        <div
          class="text-white text-center me-2 d-flex align-items-center justify-content-center"
        >
          <i class="material-icons opacity-10">link</i>
        </div>
        <span class="nav-link-text ms-1">Links</span>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link text-white " href="./pages/sign-in.html">
        <div
          class="text-white text-center me-2 d-flex align-items-center justify-content-center"
        >
          <i class="material-icons opacity-10">link</i>
        </div>
        <span class="nav-link-text ms-1">Sign In</span>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link text-white " href="./pages/sign-up.html">
        <div
          class="text-white text-center me-2 d-flex align-items-center justify-content-center"
        >
          <i class="material-icons opacity-10">assignment</i>
        </div>
        <span class="nav-link-text ms-1">Sign Up</span>
      </a>
    </li>
  </ul>
</div>
<div class="sidenav-footer position-absolute w-100 bottom-0 ">
  <div class="mx-3">
    <a
      class="btn bg-gradient-primary mt-4 w-100"
      href="https://www.creative-tim.com/product/material-dashboard-pro?ref=sidebarfree"
      type="button">Upgrade to pro</a
    >
  </div>
</div>
</aside>