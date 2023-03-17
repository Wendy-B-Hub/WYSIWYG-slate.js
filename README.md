WYSIWYG-slate.js

# Slate.js Editor

This is a simple text editor built with Slate.js that allows you to format text with basic formatting options such as bold, italic, underline, code, unordered list, and hotkeys. It also allows you to add links, images, and headings (h1, h2).

## Features

- Bold: Select text and click the "B" button or press Ctrl/Command + B to bold it.
- Italic: Select text and click the "I" button or press Ctrl/Command + I to italicize it.
- Underline: Select text and click the "U" button or press Ctrl/Command + U to underline it.
- Code: Select text and click the "C" button or press Ctrl/Command + C to format it as code.
- Unordered List: Select text and click the "ul" button or press Ctrl/Command + L to create an unordered list.
- Link: Select text and click the "Link" button to add a hyperlink.
- Image: Click the "Image" button to add an image from a URL.
- Headings: Select text and click the "H1" or "H2" or "H3" or "H4" button to turn it into a heading.


## editor :

![alt text](https://github.com/Wendy-B-Hub/WYSIWYG-slate.js/blob/main/editor.jpg)

## data fetch from database 

in order to fecth data and render data parallelly, we use `useQuery` hook in `fetchData.jsx`

the index of main react project

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
  </React.StrictMode>
);

```

`fetchData.jsx` to fetch data and pass it as prop to `WysiwygEditor` component
```javascript
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
```

## data transfer flow 



                       ┌─────────┐                        ┌──────────────┐
                       │ React   │                        │ This Repo    │
                       │ .index  │                        │              │
                       └─────────┘                        └──────────────┘
                             │                                      │
                             │                                      │
                      (1)    ▼                                      │
                  ┌───────────────┐                                 │
                  │React.App      │                                 │
                  │               │                                 │
                  └───────────────┘                                 │
                             │                                      │
                      (2)    ▼                                      │
                  ┌───────────────┐                                 │
                  │This Repo      │                                 │
                  │.fetchData    <──────────────────────────────────1
                  └───────────────┘                                 │
                             │                                      │
                      (3)    ▼                                      │
                  ┌───────────────┐                                 │
                  │This Repo      │                                 │
                  │index.js       │                                 │
                  └───────────────┘                                 │
                             │                                      │
                      (4)    ▼                                      │
                  ┌───────────────┐                                 │
                  │This Repo      │                                 │
                  │/Components/   │                                 │
                  │Editor        │                                  │
                  └───────────────┘                                 │
                             │                                      │
                             └─────────────────────────────────────>│
                                                                     

