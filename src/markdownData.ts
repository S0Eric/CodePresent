export enum MdTextType { Normal, Bold, Italic, BoldItalic }

export type MdTextElementType = {
  type: MdTextType;
  text: string;
}

export class MdHeadingData {
  constructor(public level: number, public textList: MdTextElementType[]) {}
}

export class MdParagraphData {
  constructor(public textList: MdTextElementType[]) {}
}

export class MdCodeBlockData {
  constructor(public text: string) {}
}

export type MdElementDataType = MdHeadingData | MdParagraphData | MdCodeBlockData

const findFirstMarker: (text: string) => [boolean, string, string, string] = (text, marker) => {

}

const parseText: (text: string) => MdTextElementType[] = text => {
  let ret = [] as MdTextElementType[];
  let rem = text;
  while (rem.length > 0) {

  }
}

const checkForHeading: (text: string) => [boolean, MdHeadingData?] = text => {
  text = text.trim();
  if (text.length > 0 && text.charAt(0) === "#") {
    let level = -1;
    let heading = "";
    for (let i = 0; i < text.length; i++) {
      if (text.charAt(i) !== "#") {
        level = i;
        heading = text.substr(i).trimLeft();
        break;
      }
    }
    if (level !== -1) {
      return [ true, new MdHeadingData(level, heading) ];
    }
  }
  return [false, undefined];
}

const checkForCodeBlock: (text: string) => [boolean, MdCodeBlockData?] = text => {
  if ((text.length >= 5 && text.substr(0, 4) === "    ") || (text.length >= 2 && text.charAt(0) === "\t")) {
    return [ true, new MdCodeBlockData(text) ];
  }
  text = text.trim();
  if (text.length > 6 && text.substr(0,3) === "```" && text.endsWith("```")) {
    return [ true, new MdCodeBlockData(text.substr(3, text.length - 6)) ];
  }
  return [ false, undefined ];
}

export const parseSourceText: (text: string) => MdElementDataType[] = text => {
  const parts = text.replace("\r", "").split("\n\n");
  let ret = [] as MdElementDataType[];
  parts.forEach(e => {
    const [isHeading, heading] = checkForHeading(e);
    if (isHeading && heading != undefined) {
      ret.push(heading);
      return;
    }

    const [isCodeBlock, codeblock] = checkForCodeBlock(e);
    if (isCodeBlock && codeblock != undefined) {
      ret.push(codeblock);
      return;
    }

    e = e.trim();
    if (e.length > 0) {
      ret.push(new MdParagraphData(e));
    }
  });
  return ret;
}
