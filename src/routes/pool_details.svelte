<script context="module" lang="ts">
    export async function preload(page) {
        let query = page.query;
        //retrieve all records needed to work this page

        const poolName = query.name;
        const res = await this.fetch(`api/judge_pool?id=${query.id}`, {
            method: "PUT",
        });
        const pools: IjudgePool[] = await res.json();
        let judgeAthletes: IjudgeAthleteResult[] = [];
        pools.forEach((pool) => {
            let ja: IjudgeAthleteResult = {};
            ja.first_name = pool.first_name;
            ja.last_name = pool.last_name;
            ja.athlete_id = pool.athlete_id;
            ja.judgeResult = [];
            let judgeStatus: IjudgeResult = {};
            judgeStatus.athletic_performance = pool.athletic_performance;
            judgeStatus.judge_id = pool.judge_id;
            judgeStatus.technical_performance = pool.technical_performance;
            let r = judgeAthletes.findIndex((j) => {
                return j.athlete_id == ja.athlete_id;
            });
            if (r !== -1) {
                judgeAthletes[r].judgeResult.push(judgeStatus);
            } else {
                ja.judgeResult[0] = judgeStatus;
                judgeAthletes.push(ja);
            }
            //if ja is unique then we will just append judge result
        });
        //get judges
        //group data according to athletes this will produce 1 super array
        //with every individual member being an athlete result for both
        //AP and TP with the different judges
        return { judgeAthletes, poolName };
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";

    import Nav from "../components/Nav.svelte";
    import Sidebar from "../components/Sidebar.svelte";
    import type {
        IjudgeAthleteResult,
        IjudgePool,
        IjudgeResult,
    } from "../model/application";

    export let judgeAthletes: IjudgeAthleteResult[], poolName;
    let win: any = {};
    let active = "competition";
    judgeAthletes.forEach((j, i) => {
        let sortedAthletic = j.judgeResult.sort((a, b) => {
            return a.athletic_performance - b.athletic_performance;
        });

        let sortedTech = j.judgeResult.sort((a, b) => {
            return a.technical_performance - b.technical_performance;
        });
        console.log("sorted:", sortedTech);
        j.judgeResult.forEach((r, j) => {
            
        console.log('just j here:',judgeAthletes);
            if (judgeAthletes[i].judgeResult.length == 5) {
                sortedAthletic[0].ap_color = "red";
                sortedAthletic[4].ap_color = "red";
            }
            if (judgeAthletes[i].judgeResult.length == 7) {
                sortedAthletic[0].ap_color = "red";
                sortedAthletic[1].ap_color = "red";
                sortedAthletic[5].ap_color = "red";
                sortedAthletic[6].ap_color = "red";
            }
            sortedAthletic.forEach((a) => {
                if (a.judge_id == r.judge_id) {
                    judgeAthletes[i].judgeResult[j].ap_color = a.ap_color;
                }
            });
            if (judgeAthletes[i].judgeResult.length == 5) {
                sortedTech[0].tc_color = "red";
                sortedTech[4].tc_color = "red";
            }
            if (judgeAthletes[i].judgeResult.length == 7) {
                sortedTech[0].ap_color = "red";
                sortedTech[1].ap_color = "red";
                sortedTech[5].ap_color = "red";
                sortedTech[6].ap_color = "red";
            }
            sortedTech.forEach((a) => {
                if (a.judge_id == r.judge_id) {
                    judgeAthletes[i].judgeResult[j].tc_color = a.tc_color;
                }
            });
          
        });
        console.log('sorted tech:::::',sortedTech)
    });
    onMount(() => {
        console.log(judgeAthletes);

    });
</script>

<Sidebar {active} />
<main
    class="main-content position-relative max-height-vh-100 h-100 border-radius-lg "
>
    <Nav />

    <div class="container-fluid py-4">
        <div class="row">
            <h3>Pool Details {poolName}</h3>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="table-responsive">
                        <table class="table align-items-center mb-0">
                            <thead>
                                <tr>
                                    <th
                                        class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7"
                                        >s/n</th
                                    >
                                    <th
                                        class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                                        >first name</th
                                    >
                                    <th
                                        class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                                        >last name</th
                                    >
                                    <th
                                        class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                                    />
                                    {#each judgeAthletes[0].judgeResult as item, i}
                                        <th
                                            class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                                            >j{i + 1}</th
                                        >
                                    {/each}
                                </tr>
                            </thead>
                            <tbody>
                                {#each judgeAthletes as pool, i}
                                    <tr>
                                        <td>
                                            <p
                                                class="text-xs text-center font-weight-bold mb-0"
                                            >
                                                {i + 1}
                                            </p>
                                        </td>
                                        <td>
                                            <p
                                                class="text-xs text-center font-weight-bold mb-0"
                                            >
                                                {pool.first_name}
                                            </p>
                                        </td>
                                        <td>
                                            <p
                                                class="text-xs text-center font-weight-bold mb-0"
                                            >
                                                {pool.last_name}
                                            </p>
                                        </td>

                                        <td class="text-center">
                                            <p>TEC</p>
                                            <p>ATH</p>
                                        </td>
                                        {#each pool.judgeResult as result,i}
                                            <td
                                                >
                                               {#if pool.judgeResult[1].judge_id == i + 1}
                                                   <p class:red={pool.judgeResult[1].tc_color }>{pool.judgeResult[1].technical_performance}</p>
                                                   <br>
                                                   <p class:red={pool.judgeResult[1].ap_color}>{pool.judgeResult[1].athletic_performance}</p>
                                               {/if}
                                               {#if pool.judgeResult[2].judge_id == i + 1}
                                               <p class:red={pool.judgeResult[2].tc_color}>{pool.judgeResult[2].technical_performance}</p>
                                               <br>
                                               <p class:red={pool.judgeResult[2].ap_color}>{pool.judgeResult[2].athletic_performance}</p>
                                           {/if}
                                           {#if pool.judgeResult[0].judge_id == i + 1}
                                           <p class:red={pool.judgeResult[0].tc_color}>{pool.judgeResult[0].technical_performance}</p>
                                           <br>
                                           <p class:red={pool.judgeResult[0].ap_color}>{pool.judgeResult[0].athletic_performance}</p>
                                       {/if}
                                       {#if pool.judgeResult[3].judge_id == i + 1}
                                       <p class:red={pool.judgeResult[3].tc_color}>{pool.judgeResult[3].technical_performance}</p>
                                       <br>
                                       <p class:red={pool.judgeResult[3].ap_color}>{pool.judgeResult[3].athletic_performance}</p>
                                   {/if}
                                   {#if pool.judgeResult[4].judge_id == i + 1}
                                   <p class:red={pool.judgeResult[4].tc_color}>{pool.judgeResult[4].technical_performance}</p>
                                   <br>
                                   <p class:red={pool.judgeResult[4].ap_color}>{pool.judgeResult[4].athletic_performance}</p>
                               {/if}
                                                </td
                                            >
                                        {/each}
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

<style>
    .red{
        color: red
    }
</style>
