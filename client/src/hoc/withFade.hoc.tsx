import { ComponentType } from "react";
import { Fade } from "@mui/material";

const withFade = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return (props: P) => {
    return (
      <Fade in timeout={1000}>
        <div>
          <WrappedComponent {...props} />
        </div>
      </Fade>
    );
  };
};

export default withFade;
