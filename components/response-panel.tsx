"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText } from "lucide-react"
import { KeyValueViewer } from "@/components/key-value-viewer"
import { formatBytes } from "@/lib/utils"

interface ResponsePanelProps {
  response: any
}

export default function ResponsePanel({ response }: ResponsePanelProps) {
  if (!response) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Send a request to see the response</p>
        </div>
      </div>
    )
  }

  if (response.error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Badge variant="destructive" className="mb-2">
            Error
          </Badge>
          <p className="text-muted-foreground">{response.message}</p>
        </div>
      </div>
    )
  }

  // Format response body for display
  const formatResponseBody = () => {
    if (!response.body) return ""

    if (typeof response.body === "object") {
      return JSON.stringify(response.body, null, 2)
    }

    // Try to parse as JSON if it's a string that looks like JSON
    if (typeof response.body === "string" && (response.body.startsWith("{") || response.body.startsWith("["))) {
      try {
        const parsed = JSON.parse(response.body)
        return JSON.stringify(parsed, null, 2)
      } catch (e) {
        // Not valid JSON, return as is
      }
    }

    return response.body
  }

  // Get status color
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-emerald-500 shadow-sm shadow-emerald-500/50"
    if (status >= 300 && status < 400) return "bg-blue-500 shadow-sm shadow-blue-500/50"
    if (status >= 400 && status < 500) return "bg-amber-500 shadow-sm shadow-amber-500/50"
    if (status >= 500) return "bg-rose-500 shadow-sm shadow-rose-500/50"
    return "bg-gray-500"
  }

  // Convert headers to array for display
  const headersArray = Object.entries(response.headers || {}).map(([key, value]) => ({
    key,
    value: value as string,
  }))

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(response.status)}`}></div>
          <span className="font-medium">{response.status}</span>
          <span className="text-muted-foreground">{response.statusText}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{response.duration}ms</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>{formatBytes(response.size)}</span>
        </div>

        {/* Add a timestamp */}
        <div className="ml-auto text-xs text-muted-foreground">{new Date(response.time).toLocaleTimeString()}</div>
      </div>

      <Tabs defaultValue="body" className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="mx-4">
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="body" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <pre className="p-4 text-sm font-mono whitespace-pre-wrap">{formatResponseBody()}</pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="headers" className="flex-1 p-4 m-0">
          <KeyValueViewer items={headersArray} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
