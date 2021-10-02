import React, { useState } from "react";
// import Registration from "./components/Registration";
// import Login from "./components/Login";
// import { Route, Switch } from "react-router";
import ComposeEmail from "./ComposeEmail";
import Followups from "./Followups";
// import Testing from "./components/Testing";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
import axios from "axios";



const hide = {
  display: "none",
};



const EmailComposition = (props) => {
    console.log("Email Composition: ",props);
  const [clicked, setClicked] = useState([]);
  const [followups, setFollowups] = useState("");
  const [isHidden, setHidden] = useState(false);
  const [text, setText] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailHeader, setEmailHeader] = useState("");
  const buttonClicked = (event) => {
    event.preventDefault();
    let newValue = true;
    setHidden(!isHidden);
    setClicked((preValue) => [...preValue, newValue]);
  };

  // // GetData of followups from child component
  const getData = (t, id, f) => {
    if (id === 0) {
      setFollowups(f);
      setText(t);
    }
  };
  const emailData = (data, compose) => {
    setEmailBody(data);
    setEmailHeader(compose);
  };

  // post data using fetch api
  const postData = async (event) => {
    event.preventDefault();
    let cem = {};
    const filedata=props.csvdata
    const file=props.fl
    console.log(filedata);
    if (followups.length !== 0 && text.length !== 0) {
      cem = {
        filedata,
        emailBody,
        emailHeader,
        followups,
        text,
        file
      }
      
    }else{
      cem = {
        filedata,
        emailBody,
        emailHeader,  
        file    
      }
    }
    // const res = await fetch("/emails", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: cem,
    // });
    const response = await axios({
        method:"POST",
        url:"http://localhost:8080/emails",
        data: cem
    })
    // const data = await res.json();
    // console.log("JSON DATA", data);
    // response=await axios({
    //         method:"GET",
    //         url:"http://localhost:8080/reademails"
    //     })
    // console.log(response);
  };
  function deleteFollowup(id) {
    setClicked((prevNotes) => {
      return prevNotes.filter((data, index) => {
        return index !== id;
      });
    });
    setHidden(!isHidden);
  }

  return (
    <>
      {/* <Switch> */}
      {/* <Route exact path="/" component={Registration} /> */}
      {/* <Route exact path="/signin" component={Login} /> */}
      {/* <Route exact path="/compose" component={ComposeEmail} /> */}
      <ComposeEmail getEmailData={emailData} email={props.em} userEmail={props.usermail} />
      {clicked.map((data, index) => {
        return (
          <Followups
            onDelete={deleteFollowup}
            getText={getData}
            id={index}
            key={index}
          />
        );
      })}
      <button
        className="btn btn-outline-success"
        onClick={buttonClicked}
        style={isHidden ? hide : null}
      >
        Follow-ups
      </button>
      <button className="btn btn-outline-info" onClick={postData}>
        Send Data
      </button>
      {/* </Switch> */}
    </>
  );
};

export default EmailComposition;
