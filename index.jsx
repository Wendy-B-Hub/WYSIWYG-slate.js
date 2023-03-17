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

  const [document,updateDocument]=useState(text);

 
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
