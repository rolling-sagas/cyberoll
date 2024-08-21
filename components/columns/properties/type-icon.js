import {
  Image01Icon,
  Raw01Icon,
  TextIcon,
  TextNumberSignIcon,
} from "@hugeicons/react";

export default function TypeIcon({ type }) {
  if (type === "str") {
    return <TextIcon />;
  }
  if (type === "num") {
    return <TextNumberSignIcon />;
  }
  if (type === "obj") {
    return <Raw01Icon />;
  }
  if (type === "img") {
    return <Image01Icon />;
  }
}
