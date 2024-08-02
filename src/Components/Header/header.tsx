import React from "react";

import "./header.css";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <div>
      <h1 className="textTitle">{title}</h1>
    </div>
  );
}
