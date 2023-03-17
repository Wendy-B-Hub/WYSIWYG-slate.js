import React, {useState, useEffect, useCallback} from "react";
import Editor from './components/Editor';
// import ExampleDocument from './utils/ExampleDocument'
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  CssBaseline
} from "@mui/material";


export default function WysiwygEditor({text}) {

  const data=[{"type":"h1","children":[{"text":"Hello World! "}]},{"type":"h2","children":[{"text":"This is my paragraph inside "}]},{"type":"h3","children":[{"text":"a sample document."}]},{"type":"paragraph","children":[{"text":"khdkwahkfahk","bold":true,"italic":true,"underline":true}]},{"type":"paragraph","children":[{"text":"今天是我的生日，我的祖国"}]}];
  const [document,updateDocument]=useState(data);
  useCallback(()=>{

  },[])
  //why comment out and save this, will render page
  const handleSave=()=>{
     fetch("http://localhost:3000/save",{
      method:'POST',
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify(document)
    }).then((res)=>res.data)
  }

  return (
      <Box sx={{display:'flex'}}>
        <CssBaseline/>
        <AppBar>
          <Toolbar>
            <Typography>
              WYSIWYG Editor
            </Typography>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{paddingTop:'3rem',marginLeft:'25%',marginRight:'25%'}}>
          <Toolbar/>
          <Container>
              <Editor document={document} onChange={updateDocument}/>
            <div style={{textAlign:"center",marginTop:'1.5rem'}}>
              <Button variant={"outlined"} onClick={handleSave}>
                save
              </Button>
            </div>
          </Container>
        </Box>
      </Box>
  );
}
