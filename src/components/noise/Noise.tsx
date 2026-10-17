import { useMemo } from "react";
import { makeGrainTile } from "../../utils/utils";
import "./Noise.css";

const Noise = () => {
  const tile = useMemo(() => makeGrainTile(), []);
  return (
    <div
      className="grain"
      aria-hidden="true"
      style={{ backgroundImage: `url(${tile})` }}
    />
  );
};

export default Noise;
