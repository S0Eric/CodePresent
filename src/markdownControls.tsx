import { Component, For } from "solid-js"
import { Switch, Match } from "solid-js/dom"
import { MdHeadingData, MdParagraphData, MdCodeBlockData, MdElementDataType, MdTextElementType, MdTextType } from "./markdownData"

const MdTextList: Component<{ data: MdTextElementType[] }> = props => (
  <>
    <For each={props.data}>
      {d => (
        <Switch fallback={d.text}>
          <Match when={d.type === MdTextType.BoldItalic}>
            <strong><em>{d.text}</em></strong>
          </Match>
          <Match when={d.type === MdTextType.Bold}>
            <strong>{d.text}</strong>
          </Match>
          <Match when={d.type === MdTextType.Italic}>
            <em>{d.text}</em>
          </Match>
          <Match when={d.type === MdTextType.CodeBlock}>
            <MdCodeBlock data={new MdCodeBlockData(d.text)} />
          </Match>
        </Switch>
      )}
    </For>
  </>
)

const MdHeading: Component<{ data: MdHeadingData }> = props => (
  <Switch fallback={<h6><MdTextList data={props.data.textList}/></h6>}>
    <Match when={props.data.level <= 1}>
      <h1>{<MdTextList data={props.data.textList}/>}</h1>
    </Match>
    <Match when={props.data.level === 2}>
      <h2>{<MdTextList data={props.data.textList}/>}</h2>
    </Match>
    <Match when={props.data.level === 3}>
      <h3>{<MdTextList data={props.data.textList}/>}</h3>
    </Match>
    <Match when={props.data.level === 4}>
      <h4>{<MdTextList data={props.data.textList}/>}</h4>
    </Match>
    <Match when={props.data.level === 5}>
      <h5>{<MdTextList data={props.data.textList}/>}</h5>
    </Match>
  </Switch>  
)

export const MdParagraph: Component<{ data: MdParagraphData }> = props => (
  <p>{<MdTextList data={props.data.textList}/>}</p>
)

export const MdCodeBlock: Component<{ data: MdCodeBlockData }> = props => {
  const doClick: (e: MouseEvent) => void = e => {
    if (window.getSelection && e.target) {
      const range = document.createRange();
      const node = e.target as HTMLElement;
      if (node) {
        node.classList.add("mdcode-clicked");
        setTimeout(() => node.classList.remove("mdcode-clicked"), 500);
        const textNode = node.firstChild as Node;
        range.selectNode(textNode);
        window.getSelection()?.addRange(range);
        document.execCommand("copy");
        window.getSelection()?.removeAllRanges();
      }
    }
  }
  return <pre class="mdcode" onClick={doClick}>{props.data.text}</pre>
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
