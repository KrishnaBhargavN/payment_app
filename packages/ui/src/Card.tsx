import React from "react";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border p-4">
      <h1 className="text-xl border-b pb-2">{title}</h1>
      <div>{children}</div>
    </div>
  );
}

export default Card;
