import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Followups = (props) => {
  const [text, setText] = useState("");
  const [followup, setFollowup] = useState({
    days: "",
    subject: "",
  });
  // useEffect(() => {
  //   console.log("\nfollowup0days:", followup0.days);
  //   console.log("followup1days:", followup1.days);
  // });

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFollowup({ ...followup, [name]: value });
  };
  function handleDelete(){
    props.onDelete(props.id)
}

  return (
    <>
      <input
        type="text"
        placeholder="number of days"
        name="days"
        value={followup.days}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Subject"
        name="subject"
        value={followup.subject}
        onChange={handleChange}
      />
      <input type="text" placeholder="On Reply" disabled />
      <CKEditor
        editor={ClassicEditor}
        // data={followup.emailBody}
        // value={followup.emailBody}
        onChange={(event, editor) => {
          const data = editor.getData();
          props.getText(data, props.id, followup);
        }}
        config={{
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
          ],
        }}
      />

      <button className="btn btn-outline-success" onClick={handleDelete}>Delete Folloup</button>
    </>
  );
};
export default Followups;
