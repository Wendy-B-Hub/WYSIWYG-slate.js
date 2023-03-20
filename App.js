import React, {useEffect,useState} from "react";

import FetchData from './wysiwyg-editor/fetchData'

// the better approach would be fetching data and rendering it parallelly useQuery
export default function App(){
  const id='64jhjhjhjhjhjhj'
  const collection='document'
  return(
      <>
        <FetchData id={id} collection={collection}/>
      </>
  )
}
