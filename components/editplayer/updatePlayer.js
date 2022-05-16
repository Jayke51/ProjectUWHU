import { useState, useRef } from "react";
import axios from "axios";

export default function EditPlayer({player}) {
   
    

    async function editPlayer() {
       const { id } = player.id


        await axios.put("/api/editFood", {
          id: parseInt(player?.id),
         
          goal,
          
        });
        window.location.reload();
    }
}