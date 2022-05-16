import { clearPreviewData } from 'next/dist/server/api-utils';
import Head from 'next/head'
import Image from 'next/image'
const axios = require('axios').default
import React, { useState, useEffect } from 'react';

const Team1 = 'Black' //Team 1 IS BLACK
const Team2 = 'White' //Team 2 IS WHITE

export async function getStaticProps(){
    
    
    const playerListTeam1Req = await axios.get('http://127.0.0.1:3000/api/apiPlayer', {
    params:{
        Team : Team1
    
    }}
    )

    const playerListTeam2Req = await axios.get('http://127.0.0.1:3000/api/apiPlayer', {
    params:{
        Team : Team2
    
    }}
    )

     
    const [playerListTeam1] = await Promise.all([playerListTeam1Req])
    const [playerListTeam2] = await Promise.all([playerListTeam2Req])
    
    
    return {
        props : {
            playerListTeam1 : playerListTeam1.data,
            playerListTeam2 : playerListTeam2.data
        }
    };
};





function Home({playerListTeam1, playerListTeam2}){

    
    playerListTeam1.map(player => {
        addGoalOnDb(player.id,0)
    })

    playerListTeam2.map(player =>{
        addGoalOnDb(player.id,0)
    })
    
    

    const blackPlayersSetupButton = []
    for (let i in playerListTeam1){
        blackPlayersSetupButton.push(<div><button onClick={() => addGoal(playerListTeam1[i])}>{playerListTeam1[i].Nom} {playerListTeam1[i].Prenom}</button></div>)
        
    }
    
    
    const whitePlayersSetupButton = []
    for (let i in playerListTeam2){
        whitePlayersSetupButton.push(<div><button onClick={() => addGoal(playerListTeam2[i])}>{playerListTeam2[i].Nom} {playerListTeam2[i].Prenom}</button></div>)
        
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
                    Goal : 1
                },
                
            ])
        }
        const updateListScorer = (i,player) => {
            const newList = [...listScorer];
            newList[i] = {
                id : player.id,
                Goal : listScorer[i].Goal + 1
            }
            setListScorer(newList)
        }
     
        isInList = false
        if (player.Team === 'Black'){
            setBlackScore(blackScore + 1)
        }else{
            setWhiteScore(whiteScore + 1)
        }
        
        while (isInList === false &&  i < listScorer.length && firstTime > 0 ){
            console.log(`i est = ${i}`)
            console.log('on est dans while')
            if (listScorer[i].id === player.id){
                console.log('on est dans if')
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
        console.log(`${player.Prenom} as scored a Goal`)
        
        
    }

    function addGoalOnDb(playerId,playerGoal){
        axios.put('http://127.0.0.1:3000/api/apiPlayer', {

            params:{
                id : playerId,
                Goal: playerGoal
            }}).catch('ça marche').
                catch(console.log(`${playerGoal} but ajouet à ${playerId} sur la db`))
    
}
    

    function EndMatch() {

        console.log('end of the match ')


        
            
        
    }
    
    









            
    
    return (
        
        <>
            <h1> Score Game </h1>
            <h1> {blackScore} - {whiteScore} </h1>
            {blackPlayersSetupButton}
            <br/>
            {whitePlayersSetupButton}


            <button onClick={() => EndMatch()}> Finir le Match </button>
        </>
        
    )

}


export default Home