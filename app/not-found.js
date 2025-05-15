import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import Link from "next/link"

export default function NotFound() {
  return <div className="h-full w-full flex justify-center items-center">
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle className="text-lg">Ooops! The content is Not Found!</AlertTitle>
      <AlertDescription>
        <Link href="/srch">Go to search other interesting contents&gt;&gt;</Link>
      </AlertDescription>
    </Alert>
  </div>
}
