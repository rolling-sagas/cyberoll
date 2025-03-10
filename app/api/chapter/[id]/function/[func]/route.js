export const runtime = "edge";

import prisma from "@/prisma/client";
import { ArrayToKeyValue } from "@/utils/utils";
import { isKnownError } from "@/app/api/common";

if (typeof String.prototype.parseFunction != 'function') {
  String.prototype.parseFunction = function() {
    var funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gmi;
    var match = funcReg.exec(this.replace(/\n/g, ' '));

    if (match) {
      return new Function(match[1].split(','), match[2]);
    }

    return null;
  };
}

const LIST_LIMIT = 512;

function callFunction(functionName, content, props) {
  const funcProp = props.find(
    (prop) => prop.name === functionName && prop.type === "func",
  );

  if (!funcProp) {
    throw {
      message: "Function name not found: " + functionName,
      type: "function-call"
    }
  }

  // console.log(funcProp.value)
  const func = funcProp.value.parseFunction();
  const res = func(content, ArrayToKeyValue(props));

  return res
}

export async function POST(req, { params }) {
  const sid = parseInt(params.id); // chapterId
  const name = params.func

  let content = null

  try {
    const data = await req.json();
    content = data.content ?? content
  } catch (e) {
    console.log("no post body");
  }

  try {
    const props = await prisma.property.findMany({
      skip: 0, // always start from 0
      take: LIST_LIMIT,
      where: { chapterId: sid },
      orderBy: { createdAt: "desc" },
    })

    const res = callFunction(name, content, props)

    if (res.send) {
      await prisma.chapter.update({
        where: { id: sid },
        data: {
          messages: {
            create: { role: "user", content: JSON.stringify({ data: res.send }) },
          },
          updatedAt: new Date(),
        },
        include: {
          messages: true,
        },
      });
    }

    return Response.json({ ok: true, generate: res.send != null })
  } catch (e) {
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
