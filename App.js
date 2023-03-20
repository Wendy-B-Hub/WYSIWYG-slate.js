import React, {useEffect,useState} from "react";
import Template from "./template";

import FetchData from './wysiwyg-editor/fetchData'

// the better approach would be fetching data and rendering it parallelly useQuery
export default function App(){
  const id='6413fb2c6024d95c33d1edf7'
  const collection='document'
  return(
      <>
        <FetchData id={id} collection={collection}/>
      </>
  )
}