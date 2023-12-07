import React from "react";

interface CaloryItemProps {
  text: string;
  icon: JSX.Element;
  value: string;
}
export function CaloryItem(props: CaloryItemProps) {
  return (
    <div className="flex flex-row items-center text-xl lg:text-2xl font-normal">
      <div className="h-8 md:h-10 aspect-square">{props.icon}</div>
      <p className="ml-2 whitespace-nowrap">
        {" "}
        {props.value + " " + props.text}
      </p>
    </div>
  );
}

export default CaloryItem;
