import { useState, KeyboardEvent } from 'react'
import { ArrowUp } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Building2, MessageCircle, Cloud, Mail, FileSearch } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Composer({ input, setInput, handleSubmit }) {
  const [value, setValue] = useState("all")

  const options = [
    { value: "all", label: "All of Acme Co", icon: Building2 },
    { value: "slack", label: "Slack", icon: MessageCircle },
    { value: "salesforce", label: "Salesforce", icon: Cloud },
    { value: "email", label: "Email & calendars", icon: Mail },
    { value: "custom", label: "Custom", icon: FileSearch },
  ]

  const selectedOption = options.find(option => option.value === value)

  const sendResponse = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit();
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault()
      handleSubmit();
    }
  }

  return (
    <div className="relative z-10 flex w-full flex-col bg-background mx-auto max-w-3xl px-2 sm:px-3 md:px-4 pb-0 sm:pb-0 md:pb-0 ">
      <div className="rounded-b-xl">
        <form onSubmit={sendResponse} className="bg-white relative rounded-xl border border-gray-300 transition-all focus-within:border-blue-500 focus-within:shadow-md">
          <div className="@container/textarea bg-background relative z-10 grid rounded-xl">
            <textarea
              id="chat-main-textarea"
              name="content"
              placeholder="Ask a follow up…"
              className="resize-none overflow-hidden w-full flex-1 bg-transparent px-3 py-3 text-sm leading-tight outline-none ring-0"
              style={{ 
                minHeight: '42px', 
                maxHeight: '384px',
                height: '42px' // Set initial height explicitly
              }}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize logic
                e.target.style.height = '42px';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center gap-2 p-3 pt-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-label="Select source"
                    className="h-8 w-auto justify-start text-left font-normal"
                  >
                    {selectedOption && <selectedOption.icon className="mr-2 h-4 w-4" />}
                    <span className="flex-grow">{selectedOption ? selectedOption.label : "Select source"}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {options.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setValue(option.value)}
                    >
                      <option.icon className="mr-2 h-4 w-4" />
                      <span>{option.label}</span>
                      {value === option.value && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="ml-auto flex items-center gap-2">
                <button
                  className="focus-visible:ring-offset-background inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none ring-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 has-[:focus-visible]:ring-2 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 disabled:border-gray-400 text-background border-gray-900 bg-gray-900 hover:border-gray-700 hover:bg-gray-700 focus:border-gray-700 focus:bg-gray-700 focus-visible:border-gray-700 focus-visible:bg-gray-700 h-8 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] rounded-lg"
                  type="submit"
                >
                  <ArrowUp className="size-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <p className="py-2 text-center text-xs text-gray-500">This is a prototype.</p>
    </div>
  )
}