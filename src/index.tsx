import { render } from "solid-js/dom"
import { App } from "./App"

// When the window loads, render the App control under the "root" element in index.html.
// Then start updating the state every second.
if (window.addEventListener) {
  window.addEventListener("load", () => {
    render(() => <App />, document.getElementById("root") as Node);
  })
}
