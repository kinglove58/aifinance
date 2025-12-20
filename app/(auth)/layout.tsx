import React from "react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return <div className="p-40 flex justify-center">{children} </div>;
};

export default AuthLayout;
