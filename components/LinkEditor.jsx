import React,{useRef,useEffect} from "react";
import {
  Card,
  CardActions,
  CardContent,
    Typography
} from '@mui/material'
import {Editor,} from "slate";
import { useEditor,ReactEditor } from "slate-react";

export default function LinkEditor({ editorOffsets }){
  const linkEditorRef = useRef(null);
  const editor = useEditor();
  const [linkNode, path] = Editor.above(editor, {
    match: (n) => n.type === "link",
  });

  useEffect(() => {
    const linkEditorEl = linkEditorRef.current;
    if (linkEditorEl == null) {
      return;
    }

    const linkDOMNode = ReactEditor.toDOMNode(editor, linkNode);
    const {
      x: nodeX,
      height: nodeHeight,
      y: nodeY,
    } = linkDOMNode.getBoundingClientRect();

    linkEditorEl.style.display = "block";
    linkEditorEl.style.top = `${nodeY + nodeHeight - editorOffsets.y}px`;
    linkEditorEl.style.left = `${nodeX - editorOffsets.x}px`;
  }, [editor, editorOffsets.x, editorOffsets.y]);

  if (editorOffsets === null) {
    return null;
  }
  return(
      <Card ref={linkEditorRef} sx={{ width: '15rem',height:'10rem' }}>
        <CardContent>
        </CardContent>
      </Card>
  )
}