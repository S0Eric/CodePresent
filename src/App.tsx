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
    <button class="parseButton" onClick={doClick}>{store.state.showDocument ? "Back" :  "Parse"}</button>
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

// import { Show, For } from "solid-js/dom"
// import { Store } from "./store"

// This component is shown instead of the list of values when the list is empty.
// const FallBackNoValues: Component = () => <><p /><div style="color: purple">No Values</div></>

// type ValuePropsType = { value: number; }

// // This component renders a single value from the values list.
// const Value: Component<ValuePropsType> = ({ value }) => {
//   //console.log(`Rendering Value: ${value}`);
//   return <div>{value}</div>;
// };

// type AppPropsType = { store: Store; }

// // This component displays the current state's count value, with a background color that
// // depends if it is even or odd. It also displays the state's values list.
// export const App: Component<AppPropsType> = ({ store: { state }}) => {
//   //console.log("Rendering App");
//   const getBgColor = () => (state.count % 2 === 0 ? "orange" : "lightgreen");
//   return (
//     <>
//       <div style={{ "background-color": getBgColor() }}>{state.count}</div>
//       <Show when={state.values.length > 0} fallback={<FallBackNoValues />}>
//         <ul>
//           <For each={state.values}>
//             {v => <li><Value value={v} /></li>}
//           </For>
//         </ul>
//       </Show>
//     </>
//   )
// }
