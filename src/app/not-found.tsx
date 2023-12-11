import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div
      className={
        "w-full h-full items-center justify-center flex flex-col gap-4"
      }
    >
      <h2 className={"text-2xl"}>Not Found</h2>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}
