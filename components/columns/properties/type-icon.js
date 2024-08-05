import {
  Image01Icon,
  Raw01Icon,
  TextIcon,
  TextNumberSignIcon,
} from "@hugeicons/react";

export default function TypeIcon({ type }) {
  if (type === "string") {
    return <TextIcon />;
  }
  if (type === "number") {
    return <TextNumberSignIcon />;
  }
  if (type === "object") {
    return <Raw01Icon />;
  }
  if (type === "image") {
    return <Image01Icon />;
  }
}
