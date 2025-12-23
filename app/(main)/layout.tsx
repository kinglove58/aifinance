import React from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: layoutProps) => {
  return <div className="my-32 container mx-auto">{children}</div>;
};

export default layout;
