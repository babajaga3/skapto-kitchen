"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Microwave, ChevronsUpDown } from "lucide-react"


type SkaptoKey = "sk1" | "sk2c" | "sk2k" | "sk3"

export function SkaptoSelector() {
  const [position, setPosition] = React.useState<SkaptoKey>("sk1")
  
  const tr: Record<SkaptoKey, string> = {
    sk1: "Skaptopara I",
    sk2c: "Skaptopara II (card)",
    sk2k: "Skaptopara II (key)",
    sk3: "Skaptopara III"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} className={"flex justify-between h-auto hover:!bg-accent"}>
          <div className="flex items-center gap-2">
            <Microwave className="size-8" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">
                Current Kitchen
              </span>
              <span className="">
                {tr[position]}
              </span>
            </div>
          </div>
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
        <DropdownMenuLabel>Select your kitchen</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="sk1">Skaptopara I</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sk2c">Skaptopara II (card)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sk2k">Skaptopara II (key)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sk3">Skaptopara III</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
