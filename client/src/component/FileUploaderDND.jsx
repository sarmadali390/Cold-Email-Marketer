import React, { useState, useEffect } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BsTable } from "react-icons/bs";
// import { AiOutlineTable } from "react-icons/ai";
// import {parse} from 'papaparse';
import * as XLSX from "xlsx";

export default function FileUploaderDND(props) {
  const [rows, setRows] = useState([]);
  const [csvfile,setcsvFile]=useState([])
  // const [emails, setEmails] = useState([]);

  const state = {
    inDropZone: false,
    fileList: [],
  };
  // const [fle,setFle] = useState()
  const reducer = (state, action) => {
    switch (action.type) {
      case "AddToDropZone":
        return { ...state, inDropZone: action.inDropZone };
      case "AddToList":
        return { ...state, fileList: state.fileList.concat(action.files) };
      default:
        return state;
    }
  };

  const [data, dispatch] = React.useReducer(reducer, state);

  const handleDragEnter = (event) => {
    event.preventDefault();
    dispatch({ type: "AddToDropZone", inDropZone: true });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    dispatch({ type: "AddToDropZone", inDropZone: true });
  };
  // const readFile =(file) =>{
  //   new Response(file).arrayBuffer().then(function(buffer) {
  //     setcsvFile(buffer)
  //   });
  // }
  let file={}
  const handleDrop = async (event) => {
    event.preventDefault();

     file = event.dataTransfer.files[0];
    // readFile(file)

    console.log("Files: Data: ", file);

    const fileReader = new FileReader();

    fileReader.readAsText(file);

    fileReader.onload = function () {
      const dataset = fileReader.result;

      const result = dataset.split("\n").map((data) => data.split(","));

      console.log(result);
      setRows([...rows, result]);
      setcsvFile([...rows, result])
    };
  };

  const handleFileUpload = (e) => {
     file = e.target.files[0];
    // readFile(file)
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      // console.log(bstr);
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      console.log("data: ", data);
      // processData(data);
      const result = data.split("\n").map((datta) => datta.split(","));

      console.log(result);
      setRows([...rows, result]);
      setcsvFile([...rows, result])
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    let ind = 0;
    let con=0
    let emails=[]
    let daataa=[]
    try {

      
      rows[0].map((rows, i) => {
        // daataa.push(rows)
        if (i === 0) {
          rows.map((cols, index) => {
            // console.log(cols," index: ", index);
            if ( cols === "Emails" || cols === "emails" || cols === "email" || cols === "Email" ) {
              ind = index;
              console.log(cols);
              // setEmails([...emails,cols])
              emails.push(cols)
            }
          });
        } else {
          rows.map((cols, index) => {
            if (index === ind) {
              console.log(cols);
              emails.push(cols)
              // setEmails([...emails,cols])
            }
          });
        }
      });
      console.log(rows);
      props.getEmails(emails,rows,file)
      
    } catch (err) {}
  });

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm text-center ">
            <h6 className="text-muted mt-5">
              Drop in your first list of recipients
            </h6>
            <div
              id="csv"
              onDrop={(event) => handleDrop(event)}
              onDragOver={(event) => handleDragOver(event)}
              onDragEnter={(event) => handleDragEnter(event)}
            >
              <div>
                <p>
                  <BsTable size={22} /> Drop a csv file here (
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="inputfile"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file">or choose a file </label>)
                </p>
              </div>
            </div>
            {/* {rows.map((data) => {
              return data.map((d) => {
                return <p>{d}</p>;
              });
            })} */}
          </div>
        </div>
      </div>
    </>
  );
}
