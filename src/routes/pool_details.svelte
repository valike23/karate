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
    let printJudges: any[] = [];
    export let judgeAthletes: IjudgeAthleteResult[], poolName;
    let win: any = {};
    let active = "competition";
    //console.log(judgeAthletes);
    const colorJudges =()=>{
        let test: IjudgeAthleteResult[] = JSON.parse(JSON.stringify(judgeAthletes));
        
        console.log( judgeAthletes);
        test.forEach((j)=>{
            let athlete: any = {};
            athlete.athlete_id = j.athlete_id;
            athlete.first_name = j.first_name;
            athlete.last_name = j.last_name;
           let athp = JSON.parse(JSON.stringify(j.judgeResult.sort((a,b)=>{
                return a.athletic_performance - b.athletic_performance;
            })));
            athp.forEach((element ,i)=> {
                j.judgeResult.forEach((e,k)=>{
                    if(element.judge_id == e.judge_id){
                        if(i == 0){
                            j.judgeResult[k].ap_color = 'red'
                        }
                        if(i == 4){
                            j.judgeResult[k].ap_color = 'red'
                        }
                    }
                })
            });
            let tecp = JSON.parse(JSON.stringify(j.judgeResult.sort((a,b)=>{
                return a.technical_performance - b.technical_performance;
            })));
            tecp.forEach((element ,i)=> {
                j.judgeResult.forEach((e,k)=>{
                    if(element.judge_id == e.judge_id){
                        if(i == 0){
                            j.judgeResult[k].tc_color = 'red'
                        }
                        if(i == 4){
                            j.judgeResult[k].tc_color = 'red'
                        }
                    }
                })
            });
            let finalAp = 0;
            let finalTp = 0;
            j.judgeResult.filter((p)=>{
               if(p.ap_color != "red"){
                finalAp = finalAp +  p.athletic_performance
               }
               if(p.tc_color != "red"){
                finalTp = finalTp +  p.technical_performance
               }
            });
            finalAp = finalAp * 0.3;
            finalTp = finalTp * 0.7;
           

            j.judgeResult.forEach((judge,i)=>{
               
                athlete['judge' +judge.judge_id] = {
                    id: judge.judge_id,
                    athletic_performance: judge.athletic_performance,
                    ap_color: judge.ap_color || '',
                    tc_color: judge.tc_color || '',
                    technical_performance: judge.technical_performance
                    
                }
            })
            athlete.finalAp = finalAp;
            athlete.finalTp = finalTp;
            printJudges.push(athlete);

        })
        console.log(printJudges);
        //color print judge
      
    }
    colorJudges();
    onMount(() => {
    
       win = window;
       
    });
    const print =()=>{
        console.log(win);
        win.print();
    }
</script>

<Sidebar {active} />
<main
    class="main-content position-relative max-height-vh-100 h-100 border-radius-lg "
>
    <Nav />

    <div class="container-fluid py-4">
        <div class="row">
            <h3>{poolName} <button class="btn btn-sm btn-secondary float-end" on:click="{print}">print</button></h3>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div id="table" class="table-responsive">
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
                                    <th
                                        class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                                        >FAC</th
                                    >
                                    <th
                                    class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                                    >Score</th
                                >
                                <th
                                class="text-uppercase text-center text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                                >Total</th
                            >
                                </tr>
                            </thead>
                            <tbody>
                                {#each printJudges as pool, i}
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
                                       
                                      <td >
                                          <p class="{pool.judge1.ap_color}">{pool.judge1.athletic_performance}</p>
                                          <p class="{pool.judge1.tc_color}">{pool.judge1.technical_performance}</p>
                                      </td>
                                      <td >
                                        <p class="{pool.judge2.ap_color}">{pool.judge2.athletic_performance}</p>
                                        <p class="{pool.judge2.tc_color}">{pool.judge2.technical_performance}</p>
                                    </td>
                                    <td >
                                        <p class="{pool.judge3.ap_color}">{pool.judge3.athletic_performance}</p>
                                        <p class="{pool.judge3.tc_color}">{pool.judge3.technical_performance}</p>
                                    </td>
                                    <td >
                                        <p class="{pool.judge4.ap_color}">{pool.judge4.athletic_performance}</p>
                                        <p class="{pool.judge4.tc_color}">{pool.judge4.technical_performance}</p>
                                    </td>
                                    <td >
                                        <p class="{pool.judge5.ap_color}">{pool.judge5.athletic_performance}</p>
                                        <p class="{pool.judge5.tc_color}">{pool.judge5.technical_performance}</p>
                                    </td>
                                        <td>
                                          <p> <strong> *0.7</strong> </p><br> <p><strong>*0.3</strong></p>
                                        </td>
                                        <td>
                                            <p>{(pool.finalTp).toFixed(2)}</p>
                                            <p>{(pool.finalAp).toFixed(2)}</p>
                                        </td>
                                        <td>
                                            <p>{(pool.finalAp + pool.finalTp).toFixed(2)}</p>
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

<style>
    .red {
        color: red;
        text-decoration: line-through;
    }
</style>
