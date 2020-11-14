import { error } from "console"
import { Component } from "solid-js"
import { Switch, Match } from "solid-js/dom"
import { MdHeadingData, MdParagraphData, MdCodeBlockData, MdElementDataType } from "./markdownData"

export const MdHeading: Component<{ data: MdHeadingData }> = props => (
  <Switch fallback={<h6>{props.data.text}</h6>}>
    <Match when={props.data.level <= 1}>
      <h1>{props.data.text}</h1>
    </Match>
    <Match when={props.data.level === 2}>
      <h2>{props.data.text}</h2>
    </Match>
    <Match when={props.data.level === 3}>
      <h3>{props.data.text}</h3>
    </Match>
    <Match when={props.data.level === 4}>
      <h4>{props.data.text}</h4>
    </Match>
    <Match when={props.data.level === 5}>
      <h5>{props.data.text}</h5>
    </Match>
  </Switch>  
)

export const MdParagraph: Component<{ data: MdParagraphData }> = props => (
  <p>{props.data.text}</p>
)

export const MdCodeBlock: Component<{ data: MdCodeBlockData }> = props => {
  // let codeElem: HTMLElement = undefined as unknown as HTMLTextAreaElement;
  const doClick = (e: MouseEvent) => {
    if (window.getSelection && e.target) {
      const range = document.createRange();
      const node = (e.target as Node).firstChild;
      if (node) {
        range.selectNode(node);
        window.getSelection()?.addRange(range);
        document.execCommand("copy");
        window.getSelection()?.removeAllRanges();
      }
    }
  }
  return (
    <pre class="mdcode" onClick={doClick}>{props.data.text}</pre>
  )
}

export const MdElement: Component<{ data: MdElementDataType }> = props => (
  <Switch fallback={<div>Unknown Markdown Element Component</div>}>
    <Match when={props.data instanceof MdHeadingData}>
      <MdHeading data={props.data as MdHeadingData} />
    </Match>
    <Match when={props.data instanceof MdParagraphData}>
      <MdParagraph data={props.data as MdParagraphData} />
    </Match>
    <Match when={props.data instanceof MdCodeBlockData}>
      <MdCodeBlock data={props.data as MdCodeBlockData} />
    </Match>
  </Switch>  
)
