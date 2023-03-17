import React,{useCallback} from "react";
import {Editor, Transforms} from "slate";
import { v4 as uuidv4 } from "uuid";

export default function useImageUploadHandler(editor, previousSelection) {
  return useCallback(
      async (event) => {
          event.preventDefault();
          const files = event.target.files;
          if (files.length === 0) {
            return;
        }
        const file = files[0];
        const fileName = file.name;
        const formData = new FormData();
        formData.append("manyImages", file);

        const id = uuidv4();

        Transforms.insertNodes(
            editor,
            {
              id,
              type: "image",
              caption: fileName,
              url: null,
              isUploading: true,
              children: [{ text: "" }],
            },
            { at: previousSelection, select: true }
        );

        //1.get secure url from our server
        const {url}=await fetch("http://localhost:3000/s3Url").then(res=>res.json())

        //2.post the image direclty to the s3 bucket
        fetch(url,{
          method:"PUT",
          headers:{
            "Content-Type": "multipart/form-data"
          },
          body:file
        })
            .then((response)=>{
              const imageUrl=url.split('?')[0]
              const newImageEntry = Editor.nodes(editor, {
                match: (n) => n.id === id,
              });
              if (newImageEntry == null) {
                return;
              }
              Transforms.setNodes(
                  editor,
                  { isUploading: false, url: imageUrl },
                  { at: newImageEntry[1] }
              );
            })
            .catch((err)=>{
              console.log(err.message)
            })
      }, [editor, previousSelection]
  )
}





