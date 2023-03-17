import { Editor, Transforms, Path, Range, Element } from "slate";
import { ReactEditor } from "slate-react";

export const createLinkNode = (href, text) => ({
  type: "link",
  href,
  children: [{ text }]
});
/*
    If the Editor isn't focused, insert the new link inside of a paragraph at the end of the Editor.
If the Editor is focused on a void node (eg. image node), insert the new link inside of a paragraph below the void node.
    If the Editor is focused inside of a Paragraph, insert the new link at the selected spot.
    If a range of text is highlighted, convert the highlighted text into a link.
    If the selected text consists of a link, remove the link and follow Rule #3 and #4.
    */

export const insertLink = (editor, url) => {
  if (!url) return;

  const { selection } = editor;
  const link = createLinkNode(url, url);

  ReactEditor.focus(editor);

  if (!!selection) {
    const [parentNode, parentPath] = Editor.parent(
        editor,
        selection.focus?.path
    );

    // Remove the Link node if we're inserting a new link node inside of another
    // link.
    if (parentNode.type === "link") {
      removeLink(editor);
    }

    if (editor.isVoid(parentNode)) {
      // Insert the new link after the void node
      Transforms.insertNodes(editor, createParagraphNode([link]), {
        at: Path.next(parentPath),
        select: true
      });
    } else if (Range.isCollapsed(selection)) {
      // Insert the new link in our last known location
      Transforms.insertNodes(editor, link, { select: true });
    } else {
      // Wrap the currently selected range of text into a Link
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: "end" });
    }
  } else {
    // Insert the new link node at the bottom of the Editor when selection
    // is falsy
    Transforms.insertNodes(editor, createParagraphNode([link]));
  }
};

export const removeLink = (editor, opts = {}) => {
  Transforms.unwrapNodes(editor, {
    ...opts,
    match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === "link"
  });
};


const createParagraphNode = (children = [{ text: "" }]) => ({
  type: "paragraph",
  children
});
