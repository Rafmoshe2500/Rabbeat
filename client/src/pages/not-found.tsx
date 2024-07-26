import React from "react";
import withFade from "../hoc/withFade.hoc";

const NotFound: React.FC = () => {
  return <div>404 - Page Not Found</div>;
};

export default withFade(NotFound);
