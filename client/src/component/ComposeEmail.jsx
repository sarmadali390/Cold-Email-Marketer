// configure ckeditor
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";

// import parser from "html-react-parser";
// import Followups from "./Followups";
// import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import "../css/Compose.css";
import { useState } from "react";

const label={
  
  border: "1px solid black"
}

const ComposeEmail = (props) => {
  
  //get email body data
  const [text, setText] = useState("");
  const [compose, setCompose] = useState({
    title: "",
    subject: "",
  });

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setCompose({ ...compose, [name]: value });
  };
  console.log("Email Composition: ", props.email);

  return (
    <>
      <label style={label}>From: {props.userEmail}</label>
      <br/>
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Recipents: {props.email[0]}
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        {props.email.map((to_emails, index) => {
          if (index > 0) {
            return <li key={index}>{to_emails}</li>;
          }
        })}
      </ul>

      {/* <input
        type="text"
        placeholder={"Recipents: "+props.email}
        name="title"
        value={compose.title}
        onChange={handleChange}
        disabled
      /> */}
      <input
        type="text"
        placeholder="Subject"
        name="subject"
        value={compose.subject}
        onChange={handleChange}
      />
      <CKEditor
        editor={ClassicEditor}
        data={text}
        onChange={(event, editor) => {
          const data = editor.getData();
          setText(data);
          props.getEmailData(data, compose); //send props data from child to parent component
        }}
        config={{
          // extraPlugins: [InsertDropDown],
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "blockQuote",
            "numberedList",
            "bulletedList",
            "|",
            "undo",
            "redo",
            "InsertDropDown",
          ],
        }}
      />
      {/* <button onClick={postData}>Send Data</button> */}

      <br />
      <br />
      <br />
    </>
  );
};

export default ComposeEmail;
