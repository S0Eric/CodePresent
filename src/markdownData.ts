/**
 * This module contains code and types for parsing the source text document. It lightly borrows from
 * markdown syntax.
 * 
 * - Headings start with 1-6 pound signs, the number of #s indicating heading level.
 * - Code blocks that don't contain blank lines can be specified by indenting the first line with
 *   4+ spaces or 1+ tab characters. See below for delimited code blocks.
 * - Any text that doesn't match the above rules are treated as paragraphs.
 * 
 * Headings and paragraphs can also contain special formatting delimiters:
 * - Text surrounded by "*" are displayed as italic.
 * - Text surrounded by "**" are displayed as bold.
 * - Text surrounded by "***" are displayed as italic/bold.
 * - Text surrounded by "```" characters are displayed as a code block.
 * 
 * Code blocks that may contain blank lines must be surrounded by three backticks - "```".
 * 
 * These rules allowed me to finish this tool quickly, but maybe someday I'll look for a full
 * featured markdown parser and integrate that. But this isn't a priority as this tool currently
 * does everything I need it to.
 */

// Describes a heading element.
export class MdHeadingData {
  constructor(public level: number, public textList: MdTextElementType[]) {}
}

// Describes a paragraph element.
export class MdParagraphData {
  constructor(public textList: MdTextElementType[]) {}
}

// Describe a code block element (only from indentation of first line). Backtick markers are
// handled as part of a paragraph.
export class MdCodeBlockData {
  constructor(public text: string) {}
}

// A union type of allowed element types.
export type MdElementDataType = MdHeadingData | MdParagraphData | MdCodeBlockData

// A heading or paragraph can contain text sections of these types.
export enum MdTextType { Normal, Bold, Italic, BoldItalic, CodeBlock }

// A heading or paragraph is parsed into a list elements of this type.
export type MdTextElementType = {
  type: MdTextType;
  text: string;
}

/**
 * Given heading or paragraph text, parse it into a list of text that is either normal, bold, italic,
 * italic/bold, or a code block.
 */
const parseText: (text: string) => MdTextElementType[] = text => {
  const markers: [string, MdTextType][] = [
    ["***", MdTextType.BoldItalic],
    ["**", MdTextType.Bold],
    ["*", MdTextType.Italic],
    ["```", MdTextType.CodeBlock]
  ];
  let ret = [] as MdTextElementType[];
  let nextPos = 0;
  // Split the text into sections, delimited by markdown bold, italic or italic/bold markers.
  while (nextPos < text.length) {
    let minPos = Number.MAX_SAFE_INTEGER;
    let minIdx = -1;
    // Find the nearest marker position.
    markers.forEach(([m, _], i) => {
      const pos = text.indexOf(m, nextPos);
      if (pos != -1 && pos < minPos) {
        minPos = pos;
        minIdx = i;
      }
    });
    // If we found a marker, store the normal text before, if any, and the marked text.
    if (minIdx != -1) {
      const [markerText, markerType] = markers[minIdx];
      if (minPos > nextPos) {
        ret.push({ type: MdTextType.Normal, text: text.substring(nextPos, minPos) });
        nextPos = minPos;
      }
      nextPos += markerText.length;
      // Skip the first newline character in code blocks.
      if (markerType === MdTextType.CodeBlock && text.charAt(nextPos) === "\n") { nextPos += 1 }
      let pastPos = text.indexOf(markerText, nextPos);
      if (pastPos === -1) { pastPos = text.length }
      if (pastPos > nextPos) {
        ret.push({ type: markerType, text: text.substring(nextPos, pastPos) });
      }
      nextPos = pastPos + markerText.length;
    }
    else {
      // Store the remainder of the text.
      ret.push({ type: MdTextType.Normal, text: text.substring(nextPos) });
      break;
    }
  }
  return ret;
}

/**
 * Given a text section, check if it's a heading, and if so, then parse it.
 */
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
      const textList = parseText(heading);
      return [ true, new MdHeadingData(level, textList) ];
    }
  }
  return [false, undefined];
}

/**
 * Given a text section, check if it's an indented code block, and if so, then parse it.
 */
const checkForCodeBlock: (text: string) => [boolean, MdCodeBlockData?] = text => {
  if ((text.length >= 5 && text.substr(0, 4) === "    ") || (text.length >= 2 && text.charAt(0) === "\t")) {
    return [ true, new MdCodeBlockData(text + "\n") ];
  }
  return [ false, undefined ];
}

/**
 * Parse text into a list of text sections. Sections are delimited by a blank line, except blank
 * lines within delimited code blocks are not treated as section breaks.
 */
const parseIntoSections: (text: string) => string[] = text => {
  // First, if newlines are encoded as "\r\n", remove the "\r"s.
  text = text.replace(/\r/g, "");
  // Replace all "\n" characters outside of delimited code blocks with a null marker character.
  // Put all the blocks into a list to be joined together again.
  let blocks = [] as string[];
  let nextPos = 0;
  while (nextPos < text.length) {
    let cbPos = text.indexOf("```", nextPos);
    if (cbPos !== -1) {
      if (cbPos > nextPos) {
        // Save regular text before code block marker.
        const regText = text.substring(nextPos, cbPos).replace(/\n\n/g, "\u0000");
        blocks.push(regText);
      }
      // Find ending code block marker.
      let endPos = text.indexOf("```", cbPos + 3);
      if (endPos === -1) { endPos = text.length }
      // Save code block, preserving blank lines.
      blocks.push(text.substring(cbPos, endPos + 3));
      nextPos = endPos + 3;
    }
    else {
      // Save remaining regular text.
      const regText = text.substring(nextPos).replace(/\n\n/g, "\u0000");
      blocks.push(regText);
      break;
    }
  }
  // Combine the saved blocks together.
  const newText = blocks.join("");
  // Now split the text into sections.
  const ret = newText.split("\u0000");
  return ret;
}

/**
 * Parse the source text into a list of the major section types: heading, codeblock, paragraph.
 */
export const parseSourceText: (text: string) => MdElementDataType[] = text => {
  const sections = parseIntoSections(text);
  let ret = [] as MdElementDataType[];
  sections.forEach(e => {
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
      const textList = parseText(e);
      ret.push(new MdParagraphData(textList));
    }
  });
  return ret;
}
