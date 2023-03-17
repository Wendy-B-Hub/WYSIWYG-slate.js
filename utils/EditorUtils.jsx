import { Editor,Transforms,Range,Element as SlateElement } from "slate";


export function getActiveStyles(editor) {
  return new Set(Object.keys(Editor.marks(editor) ?? {}));
}

export function toggleStyle(editor, style) {
  const activeStyles = getActiveStyles(editor);
  if (activeStyles.has(style)) {
    Editor.removeMark(editor, style);
  } else {
    Editor.addMark(editor, style, true);
  }
}

/*
* The current implementation of Editor.nodes finds all the nodes throughout the tree across
* all levels that are within the range of the at param and then runs match filters on it
* */
// export function getTextBlockStyle(editor) {
//   const selection = editor.selection;
//   if (selection == null) {
//     return null;
//   }
//   const topLevelBlockNodesInSelection = Editor.nodes(editor, {
//     at: editor.selection,
//     mode: "highest",
//     match: (n) => Editor.isBlock(editor, n),
//   });
//   let blockType = null;
//   let nodeEntry = topLevelBlockNodesInSelection.next();
//   while (!nodeEntry.done) {
//     const [node, _] = nodeEntry.value;
//     if (blockType == null) {
//       blockType = node.type;
//     } else if (blockType !== node.type) {
//       return "multiple";
//     }
//
//     nodeEntry = topLevelBlockNodesInSelection.next();
//   }
//   return blockType;
// }

export function getTextBlockStyle(editor) {
  const selection = editor.selection;
  if (selection == null) {
    return null;
  }
  // gives the forward-direction points in case the selection was
  // was backwards.
  const [start, end] = Range.edges(selection);

  //path[0] gives us the index of the top-level block.
  let startTopLevelBlockIndex = start.path[0];
  const endTopLevelBlockIndex = end.path[0];

  let blockType = null;
  while (startTopLevelBlockIndex <= endTopLevelBlockIndex) {
    const [node, _] = Editor.node(editor, [startTopLevelBlockIndex]);
    if (blockType == null) {
      blockType = node.type;
    } else if (blockType !== node.type) {
      return "multiple";
    }
    startTopLevelBlockIndex++;
  }
  return blockType;
}


export function toggleBlockType(editor, expectedBlockType) {

  const currentBlockType = getTextBlockStyle(editor);

  // set node new block type
  let newProperties;

  if (expectedBlockType===currentBlockType){
    newProperties={
      type: 'paragraph'
    }
  }else {
    newProperties={
      type: expectedBlockType
    }
  }

  Transforms.setNodes(
      editor,
      newProperties,
  );
  // const block = { type: expectedBlockType, children: [] }
  // Transforms.setNodes(editor, block)
}

export function isLinkNodeAtSelection(editor, selection){
  if (selection == null) {
    return false;
  }

  return (
      Editor.above(editor, {
        at: selection,
        match: (n) => n.type === "link",
      }) != null
  );
}

export function toggleLinkAtSelection(editor){
  if (!isLinkNodeAtSelection(editor,editor.selection)){
    const isSelectionCollapsed=Range.isCollapsed(editor.selection);
    if (isSelectionCollapsed){
      Transforms.insertNodes(
          editor,
          {
            type:'link',
            url:'#',
            children:[{text:'link'}]
          },
          {at:editor.selection}
      )
    }else {
      Transforms.wrapNodes(
          editor,
          { type: "link", url: '#', children: [{ text: '' }] },
          {split:true,at:editor.selection}
      )
    }
  }else {
    Transforms.unwrapNodes(editor,{
      match: (n) => SlateElement.isElement(n) && n.type === "link",
    })
  }
}
















