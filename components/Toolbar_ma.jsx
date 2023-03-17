import React, {useCallback, useState,useRef} from "react";
import {
  Box,
  Button,
  Stack,
  Grid,
  Input,
  Toolbar,
  styled
} from "@mui/material";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import {
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsParagraph,
  BsTypeItalic,
  BsTypeUnderline,
  BsListUl,
  BsPencil,
  BsTypeBold,
  BsCodeSlash,
  BsQuote,
  BsCardImage,
  BsLink45Deg
} from "react-icons/bs";

import {
  getActiveStyles,
  toggleStyle,
  toggleBlockType,
} from "../utils/EditorUtils";
import { useEditor } from "slate-react";
import { insertLink } from "../components/elementLink/utils/link";

import useImageUploadHandler from '../hook/useImageUploadHandler'


const StyledToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}));



export default function ToolBar({ selection, previousSelection }){
  const editor = useEditor();  //useEditor is a Slate hook that gives us access to the Slate instance from the context

  const PARAGRAPH_STYLES = ["h1", "h2", "h3", "h4", "paragraph"];
  const CHARACTER_STYLES = ["bold", "italic", "underline", "code","link","image",'highlight','unorderedList'];

  const onBlockTypeChange = useCallback(
      (blockType) => {
        // let format=targetType.target.value;
        toggleBlockType(editor, blockType);
      },
      [editor]
  );


  /*handle image upload */
  const onImageSelected = useImageUploadHandler(editor,previousSelection);
  const fileInputRef = useRef(null);
  const handleImageUploadButtonClick=()=>{
    fileInputRef.current.click();
  }

  /*handle link  insert */
  const handleInsertLink=()=>{
    const url=prompt("Enter a url")
    insertLink(editor, url);
  }

  return(
      <Box sx={{maxWidth:'60%',display:'flex'}}>
        <Toolbar>
          <Grid container columns={12}>
            <Grid item xs={'auto'}>
              <Stack direction="row">
                {
                  PARAGRAPH_STYLES.map((blockType)=>(
                      <StyledToolTip title={blockType} arrow key={blockType}>
                        <Button variant="outlined"
                                onClick={() => onBlockTypeChange(blockType)}
                                sx={{height:'26px'}}
                                value={blockType}
                        >
                          {getLabelForBlockStyle(blockType)}
                        </Button>
                      </StyledToolTip>

                  ))
                }
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack direction="row">
                {
                  CHARACTER_STYLES.map((style)=>{
                    if (style ==='link'){
                      return(
                          <StyledToolTip title={style} arrow key={style}>
                            <Button variant="outlined" color="primary" onClick={handleInsertLink} key={style}>
                              {getIconForButton(style)}
                            </Button>
                          </StyledToolTip>
                      );
                    }else if (style ==='image'){
                      return (
                          <div key={style}>
                            <StyledToolTip title={style} arrow>
                              <Button variant="outlined" color="primary" onClick={handleImageUploadButtonClick}>
                                {getIconForButton(style)}
                              </Button>
                            </StyledToolTip>
                            <Input
                                type="file"
                                inputRef={fileInputRef}
                                onChange={onImageSelected}
                                sx={{display:'none'}}
                                multiple
                            >
                            </Input>
                          </div>

                      );
                    }else {
                      return (
                          <ToolBarButton
                              key={style}
                              tooltip={style}
                              icon={getIconForButton(style)}
                              isActive={getActiveStyles(editor).has(style) }
                              onMouseDown={(e)=>{
                                e.preventDefault()
                                toggleStyle(editor,style)
                              }}
                          />
                      );
                    }
                  })
                }
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>
      </Box>
  )
}

//it is a function component
function ToolBarButton(props) {
  const { icon, isActive,tooltip, ...otherProps } = props;
  return (
      <>
        <StyledToolTip title={tooltip} arrow>
          <Button
              variant="outlined"
              color="primary"
              {...otherProps}
          >
            {icon}
          </Button>
        </StyledToolTip>

      </>
  );
}


function getLabelForBlockStyle(blockType) {
  switch (blockType) {
    case "h1":
      return <BsTypeH1/>;
    case "h2":
      return <BsTypeH2/>;
    case "h3":
      return <BsTypeH3/>;
    case "paragraph":
      return <BsParagraph/>;
    default:
      return blockType;
  }
}


    // BsListOl,
    // BsListUl,
    // BsQuote
function getIconForButton(style) {
  switch (style) {
    case 'bold':
      return <BsTypeBold/>;
    case 'italic':
      return <BsTypeItalic/>;
    case 'underline':
      return <BsTypeUnderline/>;
    case 'code':
      return <BsCodeSlash/>;
    case 'link':
      return <BsLink45Deg/>;
    case 'image':
      return <BsCardImage/>
    case 'highlight':
      return <BsPencil/>
    case 'unorderedList':
      return <BsListUl/>
    default:
      return "";
  }
}


