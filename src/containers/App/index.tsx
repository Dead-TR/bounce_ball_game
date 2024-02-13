import { BrowserRouter } from "react-router-dom";
import { Greeting, Main } from "components";

import css from "./style.module.css";

function App() {
  return (
    <BrowserRouter>
      <div className={css.root}>
        <Greeting />
        <Main />
      </div>
    </BrowserRouter>
  );
}

export default App;
