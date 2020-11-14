import { createState, State, SetStateFunction } from "solid-js";
import { MdElementDataType } from "./markdownData";

// Initial source text.
const INIT_SOURCE_TEXT = '# Sample Heading 1\n\nThis is a sample document.\n\n' +
  'This is another paragraph, before a code block that is indented at least 4 spaces or 1 tab character.\n\n' +
  '###### Log a message to the console:\n\n' +
  '    console.log("This is some JavaScript.");\n' +
  '    heading = text.substr(i).trimLeft();\n\n' +
  '###### Here is a code block without line breaks before or after:\n\n' +
  '```if (text.length > 0) {```';

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
