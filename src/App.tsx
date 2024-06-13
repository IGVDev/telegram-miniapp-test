import "./App.css";

import FlappyBirdGame from "./game/game";
import bgImage from "./assets/bg.png";
import pipeImage from "./assets/pipe.png";
import birdImage from "./assets/bird.png";

function App() {
  return (
    <div className="App">
      <FlappyBirdGame
        width={400}
        height={400}
        birdImage={birdImage}
        pipeImage={pipeImage}
        backgroundImage={bgImage}
        domId="flappy-bird-game"
      />
    </div>
  );
}

export default App;
