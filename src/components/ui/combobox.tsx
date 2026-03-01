"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  value: string
  onValueChange: (value: string) => void
  options: string[]
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  allowCustom?: boolean
}

export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  emptyText = "No results found.",
  disabled = false,
  allowCustom = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    return options.filter(option => 
      option.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue])

  const handleSelect = (selectedValue: string) => {
    console.log("🔵 Combobox handleSelect called with:", selectedValue)
    console.log("🔵 Current value:", value)
    console.log("🔵 onValueChange function:", onValueChange)
    onValueChange(selectedValue)
    setOpen(false)
    setSearchValue("")
  }

  const handleCustomValue = () => {
    if (searchValue && !options.includes(searchValue)) {
      onValueChange(searchValue)
      setOpen(false)
      setSearchValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchValue) {
      e.preventDefault()
      if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[0])
      } else if (allowCustom) {
        handleCustomValue()
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command onKeyDown={handleKeyDown} shouldFilter={false}>
          <CommandInput 
            placeholder={`Search or type new...`} 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {allowCustom && searchValue ? (
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleCustomValue}
                  >
                    <span className="text-sm">
                      Create "<span className="font-semibold">{searchValue}</span>"
                    </span>
                  </Button>
                </div>
              ) : (
                <div className="p-2 text-sm text-muted-foreground">{emptyText}</div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(currentValue) => {
                    console.log("🟢 CommandItem onSelect triggered:", currentValue)
                    console.log("🟢 Option value:", option)
                    handleSelect(option)
                  }}
                  className="cursor-pointer hover:bg-accent"
                >
                  <div
                    className="flex items-center w-full"
                    onMouseDown={(e) => {
                      console.log("🟣 DIV onMouseDown triggered for:", option)
                      e.preventDefault()
                      e.stopPropagation()
                      handleSelect(option)
                    }}
                    onClick={(e) => {
                      console.log("🔵 DIV onClick triggered for:", option)
                      e.preventDefault()
                      e.stopPropagation()
                      handleSelect(option)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
