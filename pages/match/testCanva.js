import { prisma } from '@prisma/client'
import Head from 'next/head'
import Image from 'next/image'
const axios = require('axios')

export default function Home({dataPlayer}){

     //liste de tout les joeurs 
    const NameList = dataPlayer
    //console.log(dataPlayer)
    //////////////////////////////////////////////////////////////// Fonction de DL de F2M    
    function downloadCanvas(){ 
      var imageLink = document.createElement('a')
      var c = document.getElementById("myCanvas")
      imageLink.download = 'canvas.png'
      imageLink.href = c.toDataURL('image/png',1)
      imageLink.click()
    }
    ////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////// Fonction pour dessiner sur le Canvas 
    function drawn2myCanvas(){ 
        var c = document.getElementById("myCanvas")
        var ctx = c.getContext("2d")
        ctx.font = "30px Arial";
        let bCount = 0;
        let wCount = 0;
        NameList.forEach((player) =>{ // pour chaque joeur qu'on a fetch on le met à la bonne ligne et on écrit les BUT
            if (player.Team === 'Black'){ //chaque ligne à remplire avec les cordo
                ctx.fillText(player.Prenom,85*2, 2*(515+(25*bCount))) // Prenom
                ctx.fillText(player.Nom,185*2, 2*(515+(25*bCount)))   // Nom
                ctx.fillText(player.NumB,280*2, 2*(515+(25*bCount)))  // Numéro de Bonnet  
                ctx.fillText(player.Goal,307*2, 2*(515+(25*bCount)))  // Nombre de but 
                bCount++ 
            
            }else{ // chaque ligne à remplire avec les cordo
                ctx.fillText(player.Prenom,2*(85+340), 2*(515+(25*wCount))) // Prenom
                ctx.fillText(player.Nom,2*(185+340), 2*(515+(25*wCount)))   // Nom
                ctx.fillText(player.NumB,2*(280+340), 2*(515+(25*wCount)))  // Numéro de bonnet
                ctx.fillText(player.Goal,2*(307+340), 2*(515+(25*bCount)))  // Nombre de but 
                wCount++
              }})
        console.log("setup the player ")
    }
    //////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////// On installe le canvas sur la page
    function setupCanvas(){ 
        var c = document.getElementById("myCanvas")
        var ctx = c.getContext("2d")
        var img = document.createElement("img")
        img.src ='/images/FDM0.png'
        ctx.drawImage(img, 0, 0,1654,2339)
        console.log('draw')
    }
    //////////////////////////////////////////////////////////////


    return(
        <>
            <Head>
                <title>Test F2M</title>
            </Head>

            <body>
                <h1>test </h1>
                <div>
                    <button onClick={() =>setupCanvas()}>Afficher le canvas</button>
                    <button onClick={() =>drawn2myCanvas()}>afficher les data</button>
                    <button onClick={() =>downloadCanvas()}>Télécharger la F2M</button> 
                </div>
                
                <div>
                  <canvas id='myCanvas'width={1654} height={2339}></canvas>
                </div>
                
            </body>
        </>
        
        
    )

}

export async function getStaticProps(){
    

    const dataPlayerReq = await axios.get('http://127.0.0.1:3000/api/apiPlayer')

    const [dataPlayer] = await Promise.all([dataPlayerReq])
    
    return {
        props : {
            dataPlayer : dataPlayer.data
        }
    };
};

  

