import { createState, State, SetStateFunction } from "solid-js";
import { MdElementDataType } from "./markdownData";

// Initial source text.
const INIT_SOURCE_TEXT = '# Level 1 Heading\n' +
  '\n' +
  'Here is a regular paragraph. All sections must be separated by blank\n' +
  'lines. Note that blank lines in delimited code blocks do not cause section\n' +
  'breaks.\n' +
  '\n' +
  '### Level *3 Heading*\n' +
  '\n' +
  'You can **bold** or *italicize* text, or ***both***.\n' +
  '\n' +
  'A code block that doesn\'t contain blank lines can be specified by indenting\n' +
  'by 4+ spaces or 1+ tab characters.\n' +
  '\n' +
  '    console.log("This is some JavaScript.");\n' +
  '    heading = text.substr(i).trimLeft();\n' +
  '\n' +
  'You can also indicate a code block by surrounding it with three backtick characters.\n' +
  'This syntax supports code blocks with blank lines. The first newline character after\n' +
  'the beginning backticks is never copied to the clipboard. If the trailing backticks\n' +
  'are on a line by themselves, the copied code will end with a newline character.\n' +
  '\n' +
  '```\n' +
  'const text = readline();\n' +
  '\n' +
  'if (text.length > 0) {\n' +
  '    console.log(text);\n' +
  '}\n' +
  '```\n' +
  '\n' +
  'If you don\'t want a trailing newline character to be copied, then place the ending\n' +
  'backticks right after your code. Also, you can include a code block in a regular\n' +
  'paragraph. ```let pos = str.indexOf("!");``` But it\'s shown on separate line(s).\n';

// The type of the application state.
type StoreStateType = {
  showDocument: boolean;
  sourceText: string;
  markdownDataList: MdElementDataType[];
}

// Class that creates application state, exposes it for reading, and provides methods for updating the state.
export class Store {
  state: State<StoreStateType>
  private setState: SetStateFunction<StoreStateType>

  constructor() {
    [this.state, this.setState] = createState<StoreStateType>(this.createDefaultState());
  }

  setShowDocument(flag: boolean) { this.setState("showDocument", flag) }
  setSourceText(text: string) { this.setState("sourceText", text) }
  setMarkdownDataList(mdDataList: MdElementDataType[]) { this.setState("markdownDataList", mdDataList) }

  private createDefaultState: () => StoreStateType = () => ({ showDocument: false, sourceText: INIT_SOURCE_TEXT, markdownDataList: [] })
}
