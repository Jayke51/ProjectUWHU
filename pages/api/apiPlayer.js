///////////////////////////////////////////
//                                       //
//Copyright (c) by Hugo Bardet           //
//Fonction API pour mongo db avec prisma //
//                                       //
///////////////////////////////////////////


import { PrismaClient } from '@prisma/client'// prima permet de faciliter les requete de DB

const prisma = new PrismaClient()



////////////////////////////////////////////////////////////////fonction de séléction par rapport à la method
export default async function handler(req, res) { 
  if (req.method === 'GET') {      // si method Get on cherche 
    return await getPlayers(req,res);
  }else if(req.method === 'PUT'){  // si method PUT on update quelque chose 
    return await upPlayers(req,res);
  }else{
    return res.status(405).json({message: 'Method not allowed',sucess: false}); // messaage d'erreur 
  }
}
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////Fonction de get les players 
async function getPlayers(req, res) {
  const query = req.query; // query = la demande
  console.log(query);
  try {
    const team = await prisma.player.findMany({ // ici on prend tout comme ça plus simple 
      where :{
        id : query.id,
        name: query.name,
        surname: query.surname,
        numb : query.numb,
        cap : query.cap,
        goal : query.goal,
        team : query.team,
      }
    });
    return res.status(200).json(team, {success: true}) // on return le résult de la recherche 
  }catch(error){
    console.error("Request error", error);
    res.status(500).json({error:"error creating question", success: false}); // erreur 
  }
}
//////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////Fonction de update les joueur au cas ou de problème ou de but 
async function upPlayers(req, res){
  const params = req.body.params; // qui on veut 
  console.log(params);
  try{
    const updatePlayer = await prisma.player.update({
      where : {       // ici on choisi le joeur avec l'id
        id : params.id,
      },
      data : {        // ici on choisi ce qu'on update 
        team : params.team,
        name: params.name,
        surname: params.surname,
        numb : params.numb,
        cap : params.cap,
        goal : params.goal,
        
      }
    });
    return res.status(200).json(updatePlayer, {success: true}) // on return a la DB
    }catch(error){
      console.error("Request error", error);
      res.status(500).json({error:"error creating question", success: false}); // erreur 
  }
}
