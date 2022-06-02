///////////////////////////////////////////
//                                       //
//Copyright (c) by Hugo Bardet           //
//Page pour edit la F2M                  //
//                                       //
///////////////////////////////////////////

import Head from 'next/head'
import Image from 'next/image'
const axios = require('axios').default
import React, { useState, useEffect } from 'react';

import styles from '../../styles/FDMpage.module.css';
import 'bootstrap/dist/css/bootstrap.css';

const blackTeam = 'EKIP' //Team 1 IS BLACK
const whiteTeam = 'FC NSI' //Team 2 IS WHITE



export async function getStaticProps(){
    
    
    const playerListWhiteTeamReq = await axios.get('http://127.0.0.1:3000/api/apiPlayer', {// on cherche les joeueurs de l'équipe 1
    params:{
        team : blackTeam
    
    }}
    )

    const playerListBlackTeamReq = await axios.get('http://127.0.0.1:3000/api/apiPlayer', {// on cherche les joeueurs de l'équipe 2
    params:{
        team : whiteTeam
    
    }}
    )

    

    //////////////////////////////// On transforme la réponse en Promise
    let [playerListBlackTeam] = await Promise.all([playerListBlackTeamReq])
    let [playerListWhiteTeam] = await Promise.all([playerListWhiteTeamReq])
    ////////////////////////////////

    ////////////////////////////////On garde que la data de la rep (les obj des joeurs)
    playerListBlackTeam = playerListBlackTeam.data
    playerListWhiteTeam = playerListWhiteTeam.data
    ////////////////////////////////

    //////////////////////////////// Monitorin de la Team 1
    console.log(`chargement de l'équipe : ${blackTeam}...`)
    playerListBlackTeam.map(player =>{
        console.log(`[${player.id}] | {${player.team}} | ${player.name} ${player.surname} ${player.numb}`)
    })
    ////////////////////////////////

    console.log(`[================================================================]`)

    //////////////////////////////// Monitorin de la Team 2
    console.log(`chargement de l'équipe : ${whiteTeam}...`)
    playerListWhiteTeam.map(player =>{
        console.log(`[${player.id}] | {${player.team}} | ${player.name} ${player.surname} ${player.numb}`)
    })
    ////////////////////////////////

    
    
    return {// On exporte les 2 list de joeurs
        props : {
            playerListBlackTeam,
            playerListWhiteTeam 
        }
    };
};





export default function Home({playerListBlackTeam, playerListWhiteTeam}){
    
    

    const blackPlayersSetupButton = []
    
    for (let i in playerListBlackTeam){
        blackPlayersSetupButton.push(
        <div>
            <button class="btn btn-outline-primary"onClick={() => addGoal(playerListBlackTeam[i])} >
                {playerListBlackTeam[i].name} {playerListBlackTeam[i].surname}<br/>{playerListBlackTeam[i].numb}
                </button>
        </div>
        )
    }
    
    
    const whitePlayersSetupButton = []

    for (let i in playerListWhiteTeam){
        whitePlayersSetupButton.push(
        <div>
            <button class="btn btn-outline-secondary"onClick={() => addGoal(playerListWhiteTeam[i])}>
                {playerListWhiteTeam[i].name} {playerListWhiteTeam[i].surname} <br/> {playerListWhiteTeam[i].numb}
                </button>
        </div>
        ) 
    }


    const [blackScore,setBlackScore] = useState(0)
    const [whiteScore,setWhiteScore] = useState(0)
    
    const [firstTime,setFirstTime] = useState(0)
    const [listScorer,setListScorer] = useState([])
    let isInList = false
    
    
    function addGoal(player){
        let i = 0

        const firstTimeScore = (player) => {
            setListScorer(state => [
                ...state,
                {
                    id : player.id,
                    goal : 1
                },
                
            ])
        }
        const updateListScorer = (i,player) => {
            const newList = [...listScorer];
            newList[i] = {
                id : player.id,
                goal : listScorer[i].goal + 1
            }
            setListScorer(newList)
        }
     
        isInList = false
        if (player.team === blackTeam){
            setBlackScore(blackScore + 1)
        }else{
            setWhiteScore(whiteScore + 1)
        }
        
        while (isInList === false &&  i < listScorer.length && firstTime > 0 ){
            
            
            if (listScorer[i].id === player.id){
                
                isInList = true
                updateListScorer(i,player)
            }
            i++
            
            
        }
        i = 0

        setFirstTime(firstTime + 1)
        if (isInList === false){ 
            firstTimeScore(player)
        }
        console.log(`${player.surname} as scored a Goal`)
        
        
    }

    function addGoalOnDb(playerId,playerGoal){
        axios.put('http://127.0.0.1:3000/api/apiPlayer',{
    
            params:{
                id : playerId,
                goal: playerGoal
            }}).catch(console.log(`${playerGoal} but ajouet à ${playerId} sur la db`))
    
    }
    
    

    function EndMatch() {

        console.log('end of the match ')
        
        listScorer.map(player =>{
            console.log(`[${player.id}] | n°= ${player.goal}`)
            addGoalOnDb(player.id, player.goal)
        })
        window.location.href = "./testCanva"
        
        
        
        
    }
    

    return (
        
        <>
           <Head>
               <title>EKIP VS FC NSI²</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div class="text-center">
                <h1> Score Game </h1>
                <h1> {blackScore} - {whiteScore} </h1>    
            </div>
            
            <div className={styles.right_btm} class="btn-group-vertical">
            {blackPlayersSetupButton} 
            </div>

            <div class="btn-group-vertical">
            {whitePlayersSetupButton}
            </div>


            <br/>
            <button type="button" class="btn btn-success btn-lg btn-block" onClick={() => EndMatch()}> Finir le Match </button>
        </>
        
    )

}


