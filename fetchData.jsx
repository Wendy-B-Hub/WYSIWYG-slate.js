import {useQuery } from 'react-query'
import WysiwygEditor from './index'
import axios from 'axios';
import {BASE_URL} from './../globals.js'

// the better approach would be fetching data and rendering it parallelly useQuery
export default function FetchData({id,collection}){
  const url = `${BASE_URL}/${collection}/${id}`;
  const { data, isLoading, isError } = useQuery('myData', async () => {
    const response =await axios.get(url);
    const data = response.data;
    console.log(data)
    return data;
  });
  if (isLoading){
    return <div>loading...</div>
  }
  if (isError){
    return <div>error...</div>
  }

  return(
      <>
        <WysiwygEditor text={data}/>
      </>
  )
}