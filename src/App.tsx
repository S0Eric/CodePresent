import { Component, Show, For } from "solid-js";
import { Store } from "./store";
import { MdElement } from "./markdownControls";
import { parseSourceText } from "./markdownData";

export const App: Component = () => {
  const store = new Store();
  const doClick = () => {
    if (!store.state.showDocument) {
      let text = textareaElem.value;
      store.setSourceText(text);
      const mdElements = parseSourceText(text);
      if (mdElements.length > 0) {
        store.setMarkdownDataList(mdElements);
        store.setShowDocument(true);
      }
    }
    else {
      store.setShowDocument(false);
    }
  }
  let textareaElem: HTMLTextAreaElement = undefined as unknown as HTMLTextAreaElement;

  return (
    <div class="grid-container">
      <button class="formatButton" onClick={doClick}>{store.state.showDocument ? "Back" :  "Format"}</button>
      <Show
        when={store.state.showDocument}
        fallback={(
          <div class="mainArea">
            <textarea class="sourceText" ref={textareaElem}>{store.state.sourceText}</textarea>
          </div>
        )}>
        <div>
          <For each={store.state.markdownDataList}>
            {mdd => <MdElement data={mdd} />}
          </For>
        </div>
      </Show>
    </div>
  )
}
