import css from "./style.module.css";

import { Game } from "../../game";

function App() {
  return (
    <div className={css.root}>
      <Game />
    </div>
  );
}

export default App;
