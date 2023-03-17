import React, {useMemo, useCallback, useRef, useEffect, useState} from 'react'
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import withLinks from '../plugins/withLinks'
import useEditorConfig from '../hook/useEditorConfig'
import useSelection from '../hook/useSelection'
import Toolbar from "./Toolbar_ma.jsx";
import pipe from "lodash/fp/pipe";
// import {identifyLinksInTextIfAny} from '../components/identifyLinksInTextIfAny'

const createEditorWithPlugins = pipe(
    withReact,
    withHistory,
    withLinks
);


export default function Editor({ document, onChange }){
  const editor=useMemo(()=>createEditorWithPlugins(createEditor()),[]);
  const { renderElement,renderLeaf,onKeyDown } = useEditorConfig(editor);
  const [selection, setSelection] = useSelection(editor);


  const onChangeHandler=useCallback(
      (newDocument)=>{
        onChange(newDocument);
        setSelection(editor.selection);
        // identifyLinksInTextIfAny(editor);
      },[editor.selection, onChange, setSelection])

  return (
      <Slate editor={editor} value={document} onChange={onChangeHandler}>
        <Toolbar selection={selection}/>
        <div style={{border:'1px solid lightgray',minHeight:'250px',padding:'2rem'}}>
          <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={onKeyDown}
          />
        </div>
      </Slate>
  );
}












