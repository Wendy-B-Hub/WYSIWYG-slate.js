import {Point, Transforms,Range,Editor,Text} from "slate";



export  function identifyLinksInTextIfAny(editor){

  // if selection is not collapsed, we do not proceed with the link detection
  if (editor.selection == null || !Range.isCollapsed(editor.selection)) {
    return;
  }
  const [node] = Editor.parent(editor, editor.selection);

  // if we are already inside a link, exit early.
  if (node.type === "link") {
    return;
  }

  const [currentNode, currentNodePath] = Editor.node(editor, editor.selection);

  // if we are not inside a text node, exit early.
  if (!Text.isText(currentNode)) {
    return;
  }

  let [start] = Range.edges(editor.selection);
  const cursorPoint = start;
  const startPointOfLastCharacter = Editor.before(editor, editor.selection, {
    unit: "character",
  });

  const lastCharacter = Editor.string(
      editor,
      Editor.range(editor, startPointOfLastCharacter, cursorPoint)
  );

  // if(lastCharacter !== ' ') {
  //   return;
  // }

  let end = startPointOfLastCharacter;
  start = Editor.before(editor, end, {
    unit: "character",
  });
  const startOfTextNode = Editor.point(editor, currentNodePath, {
    edge: "start",
  });

  while (
      Editor.string(editor, Editor.range(editor, start, end)) !== " " &&
      !Point.isBefore(start, startOfTextNode)
      ) {
    end = start;
    start = Editor.before(editor, end, { unit: "character" });
    console.log(end)
  }

  const lastWordRange = Editor.range(editor, end, startPointOfLastCharacter);

  const lastWord = Editor.string(editor, lastWordRange);

  if (isUrl(lastWord)) {
    Promise.resolve().then(() => {
      Transforms.wrapNodes(
          editor,
          { type: "link", url: lastWord, children: [{ text: lastWord }] },
          { split: true, at: lastWordRange }
      );
    });
  }
}

export const myDecorator = ([node, path],editor) => {
  const nodeText = node.text;

  if (!nodeText) return [];

  const urls = findUrlsInText(nodeText);

  return urls.map(([url, index]) => {
    return {
      anchor: {
        path,
        offset: index,
      },
      focus: {
        path,
        offset: index + url.length,
      },
      decoration: "link",
      callback:()=>{
        Transforms.wrapNodes(
            editor,
            { type: "link", url: url, children: [{ text: url }] },
        );
      }
    };
  });
};


export const findUrlsInText = (text) => {
  const urlRegex =
      // eslint-disable-next-line no-useless-escape
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

  const matches = text.match(urlRegex);

  return matches ? matches.map((m) => [m.trim(), text.indexOf(m.trim())]) : [];
};

function isUrl(str) {
  // Regular expression to match a URL pattern
  const urlRegex =
      // eslint-disable-next-line no-useless-escape
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

  return urlRegex.test(str);
}