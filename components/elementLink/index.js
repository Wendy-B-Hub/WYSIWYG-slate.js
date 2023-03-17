import { useSelected, useFocused, useSlateStatic } from "slate-react";

import {BiUnlink,} from "react-icons/bi";
import {removeLink} from "./utils/link"
import {Button} from "@mui/material";
import "./index.css"

const Link=({attributes, element, children })=>{
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();
  const url=addProtocol(element.href)
  return(
      <div className="element-link">
        <a {...attributes} href={url} style={{color:'blue',cursor:'pointer'}}>
          {children}
        </a>
        {selected &&focused&& (
            <div className="popup" contentEditable={false}>
              <a href={url} target="_blank">
                {url}
              </a>
              <Button onClick={() => removeLink(editor)}>
                <BiUnlink/>
              </Button>
            </div>
        )}
      </div>
  )
}

export default Link;


function addProtocol(url) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "https://" + url;
  }
  return url;
}
























