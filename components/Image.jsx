//处理图片和captionEdit
//We update the local caption state as the user updates it and
// when they click out (onBlur) or hit RETURN (onKeyDown),
// we apply the caption to the node and switch to read mode again.
import React, {useState, useCallback, useMemo,useRef,useEffect} from "react";
import {Box,Typography,TextField,Stack} from "@mui/material";
import { makeStyles } from '@mui/styles';
import {createEditor, Editor, Transforms} from "slate";
import {withReact} from "slate-react";
import isHotkey from "is-hotkey";


const useStyle=makeStyles({
  imageContainer:{
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
  },
  image:{
    maxWidth:'100%',
  },
  caption:{
    marginTop:'8px',
    fontsize:'0.8rem',
  },
})


export default function Image({attributes,children,element}){
  const classes=useStyle();
  const [isEditingCaption,setEditingCaption]=useState(false);
  const [caption,setCaption]=useState(element.caption)
  const editor = useMemo(() => withReact(createEditor()), []);


  //===========================================================================
  //============edit the caption
  //===========================================================================
  const applyCaptionChange=useCallback(
      (captionInput)=>{
        const imageNodeEntry=Editor.above(editor,{
          match:n=>n.type==='image',
        })
        if (imageNodeEntry==null){
          return;
        }
        if (captionInput==null){
          return;
        }
        if (captionInput!= null){
          setCaption(captionInput);
        }
        Transforms.setNodes(
            editor,
            {caption:captionInput},
            {at:imageNodeEntry[1]}
        );
      },
      [editor,setCaption]
  )

  const onCaptionChange=useCallback(
      (e)=>{
        setCaption(e.target.value)
      },
      [editor.selection,setCaption]
  );

  const onKeyDown=useCallback(
      (e)=>{
        if (!isHotkey("enter",e)){
          return
        }
        applyCaptionChange(e.target.value)
        setEditingCaption(false);
      },
      [applyCaptionChange,setEditingCaption]
  )

  const onToggleCaptionEditMode=useCallback(
      (e)=>{
        const wasEditing=isEditingCaption;
        setEditingCaption(!isEditingCaption);
        wasEditing && applyCaptionChange(caption);
      },
      [editor.selection, isEditingCaption, applyCaptionChange, caption]
  )
  //============================= endpoint==============================================



  //===========================================================================
  //============when click the image it will be more large,toggle the imageSize
  //===========================================================================
  const imgRef=useRef();
  const [originalSize, setOriginalSize] = useState(null);
  const [enlargedSize, setEnlargedSize] = useState("scale(1.5)");
  const [currentSize, setCurrentSize] = useState(null);

  const toggleEnlarge=()=>{
    const img=imgRef.current;
    let current = currentSize;

    if (!current){
      current = originalSize;
    }
    if (current===originalSize){
      img.style.transform=enlargedSize;
      setCurrentSize(enlargedSize);
    }else {
      img.style.transform=originalSize;
      setCurrentSize(originalSize)
    }
    img.style.transition="transform 0.25s ease";
  }

  const handleImgLoad=()=>{
    setOriginalSize(`scale(${imgRef.current.offsetWidth / 270})`);
    setCurrentSize(originalSize);
  }
  ///=============================endpoint==============================================

  return (
      <Box contentEditable={false} {...attributes}>
        <Stack className={classes.imageContainer} spacing={2}>
          { !element.isUploading && element.url != null ? (
              <div style={{textAlign:'center'}}>
                <img src={element.url}
                     alt={caption.split('.')[0]}
                     style={{ maxWidth: '60%', maxHeight: '60%' ,cursor:'pointer'}}
                     onClick={toggleEnlarge}
                     ref={imgRef}
                     onLoad={handleImgLoad}
                />
              </div>
          ):(
              <div style={{width:'100%',height:'130px',backgroundColor:'hotpink'}}>
                {/*<Text/>*/}
              </div>
          )
          }
          {
            isEditingCaption ? (
                <TextField
                  autoFocus={true}
                  className={classes.caption}
                  defaultValue={element.caption.split('.')[0]}
                  onKeyDown={onKeyDown}
                  onChange={onCaptionChange}
                  onBlur={onToggleCaptionEditMode}
                />
            ):(
                <div className={classes.caption} onClick={onToggleCaptionEditMode}>
                  {caption.split('.')[0]}
                </div>
            )
          }
        </Stack>
        {children}
      </Box>
  )
}





































