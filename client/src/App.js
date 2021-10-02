import React, { useState, useEffect } from "react";
// import FileUploaderDND from '../src/components/FileUploaderDND';
import FileUploaderDND from "./component/FileUploaderDND";
import EmailComposition from "./component/EmailComposition";
// import './components/style.css';
import "./component/style.css";
import Google from "./component/Google";
import { Route, Switch, useHistory } from "react-router";
import axios from "axios"
// import { useHistory } from "react-router";
// import  { Link } from 'react-router-dom'

export default function App() {
  const history = useHistory()
  const [recipents, setRecipents] = useState([]);
  const [userMail,setUserEmail] = useState('No Email')
  const [csvData,setCSVData]= useState([])
  const [files,setfile]= useState()
  const handleEmail = (emails,rows,file) => {
    axios({
      method: "GET",
      url: "http://localhost:8080/useremail",
    })
      .then((response) => {
        console.log("Axios Response", response.data);
        setUserEmail(response.data)
        // window.open(response.data.url,"_self")
      })
      .catch((error) => {
        console.log("Axios Error");
        // window.open('http://localhost:3000/csv',"_self")
      });
    // recipents = emails;
    setCSVData(...rows)
    setRecipents([...emails])
    setfile(file)
    // console.log("Recipents: ", recipents);
    // window.open('http://localhost:3000/compose',"_self") 
    history.push('/compose')
    
  };
  useEffect(()=>{
    console.log("Recipents: ", recipents);
    console.log("APP CSV DATA: ", csvData);

  })

  return (
    <>
      {/* <h1>File Uploader Drag and Drop</h1> */}
      <div className="container">
        {/* <FileUploaderDND changeInputFile={setImageAction} /> */}
        <Switch>
          <Route exact path="/" component={Google} />
          <Route exact path="/csv" component={() => <FileUploaderDND getEmails={handleEmail} />} 
          />
          <Route exact path="/compose" component={() => <EmailComposition em={recipents} usermail={userMail} csvdata={csvData} fl={files}/>} />
          
        </Switch>
        {/* {recipents.map((data,index)=>{
            return <p key={index}>{data}</p>
          })} */}
      </div>
    </>
  );
}
