import { Composition } from "remotion";
import { BiotryHype } from "./BiotryHype";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BiotryHype"
        component={BiotryHype}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
