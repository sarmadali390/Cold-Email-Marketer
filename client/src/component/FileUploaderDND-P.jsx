import React, { useEffect } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {BsTable} from "react-icons/bs";
import { AiOutlineTable } from "react-icons/ai";
// import {parse} from 'papaparse';
 function FileUploaderDND(props) {
  const state = {
    inDropZone: false,
    fileList: [],
  };

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

  const handleDrop = async (event) => {
    event.preventDefault();

    let file = event.dataTransfer.files[0];
    console.log("Files: Data: ", file);

    const fileReader = new FileReader();

    fileReader.readAsText(file);

    fileReader.onload = function () {
      const dataset = fileReader.result;

      const result = dataset.split("\n").map((data) => data.split(","));

      console.log(result);
      
    };
  };

  //   useEffect(() => {
  //     if (data.fileList[0]) {
  //       console.log("data.fileList[0]: ", data.fileList[0].name);
  //       const latestImage = data.fileList[data.fileList.length - 1];
  //       let blob = latestImage.preview;
  //       let name = latestImage.name;
  //       let img = new Image();
  //       img.src = blob;

  //       let reader = new FileReader();
  //       reader.readAsDataURL(latestImage);
  //       reader.onloadend = function () {
  //         let base64data = reader.result;
  //         props.changeInputFile({
  //           name: name,
  //           file: base64data,
  //           width: img.width,
  //           height: img.height,
  //         });
  //       };
  //     }
  //   }, [data]);

  // return (
  //   <div
  //     id="fileuploaderdnd-container"
  //     className="fileuploaderdnd-container"
  //     onDrop={(event) => handleDrop(event)}
  //     onDragOver={(event) => handleDragOver(event)}
  //     onDragEnter={(event) => handleDragEnter(event)}
  //   >
  //     <div className="fileuploaderdnd-container-button">
  //       <div className="fileuploaderdnd-container-text">
  //         drag and drop an image here to see output 👉🏼
  //       </div>
  //     </div>
  //   </div>
  // );
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
              <p><BsTable size={22}/>   Drop a CSV file here ( 
                <input type="file" name="file" id="file" className="inputfile" onChange={(event) => handleDrop(event)}/>
                <label htmlFor="file">or choose a file </label>
               )</p>
            </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default  FileUploaderDND;