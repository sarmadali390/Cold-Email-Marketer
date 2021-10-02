import React from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import axios from "axios"



 const Google = ()=>{
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
     const handleButton = async(event)=>{
         event.preventDefault();
        //  const res = await fetch('/abc')
        //  const data = await res.json();
        //  console.log(data);x
        const response = await axios({
            method:"GET",
            url:"http://localhost:8080/abc"
        })
        if (response){
            console.log("Axios Response",response.data.url)
            
            window.open(response.data.url,"_self")
        //    await sleep(8000);
        //    await window.open('http://localhost:3000/csv',"_self")
            // axios({
            //     method:"GET",
            //     url:"http://localhost:8080/useremail"
            // }).then((response)=>{
            //     console.log("Axios Response",response.data)
            //     // window.open(response.data.url,"_self")
                
            // }).catch((error)=>{
            //     console.log("Axios Error")
            //     // window.open('http://localhost:3000/csv',"_self")
            // })

        }
        else{
            console.log("axios error")

        }
        
        

     }
     return (
         <>
         <h1>Hi</h1>
         <button className="btn btn-outline-success" onClick={handleButton}>Google</button>
         </>
     )
 }

 export default Google;