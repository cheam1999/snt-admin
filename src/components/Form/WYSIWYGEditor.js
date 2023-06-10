import React, { useState, useEffect } from "react";

// Components
import { EditorState, convertToRaw, ContentState, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./WYSIWYG.scss";

const WYSIWYGEditor = (props) => {

  const [editorState, setEditorState] = useState(EditorState.createWithContent(
    ContentState.createFromBlockArray(
      convertFromHTML(props.value ?? '')
    )
  ));

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    return props.onChange(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
  };

  // console.log(props.err)
  return (
   
    <>
    <div className={`editor ${props.err ? 'editor-border-invalid' : ''}`}>
      <Editor
        handlePastedText={() => false} 
        editorState={editorState}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: ['inline',  'list', 'history', 'link'],
      }}
      />
       
    </div>
    <div className='custorm-invalid-feedback'>{props.err?.message}</div>
    </>
  );
};

export default WYSIWYGEditor;
