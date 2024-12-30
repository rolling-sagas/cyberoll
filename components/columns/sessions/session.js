import ToolButton from "../chapters/tool-button";
import { ItemMenuButton, MenuButtonItem } from "@/components/buttons/menu-button";
import MessageItem from "../chapters/message-item";
import { useState, useEffect } from "react";

export default function SessionItem({session}) {
  const { components = [], chapters = [] } = session
  let allComponents = [...components]
  let allMessages = []
  chapters.forEach(ch => {
    allComponents = allComponents.concat(ch.components)
    allMessages = allMessages.concat(ch.messages)
  });



  return (
    <div>
      { allMessages.map(mess => <MessageItem key={mess.id} message={mess} components={allComponents} />) }
    </div>
  );
}
