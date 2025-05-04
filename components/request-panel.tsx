"use client"

import { useState } from "react"
import type { Collection, Request } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Send, Save, Plus } from "lucide-react"
import { KeyValueEditor } from "@/components/key-value-editor"
import { replaceEnvironmentVariables } from "@/lib/utils"

interface RequestPanelProps {
  request: Request
  updateRequest: (request: Request) => void
  updateResponse: (response: any) => void
  saveRequest: (collectionId: string, name: string) => void
  collections: Collection[]
  createCollection: (name: string) => string
  environment: { id: string; name: string; variables: Record<string, string> }
  settings: Record<string, any>
}

export default function RequestPanel({
  request,
  updateRequest,
  updateResponse,
  saveRequest,
  collections,
  createCollection,
  environment,
  settings,
}: RequestPanelProps) {
  const [isSending, setIsSending] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [saveToCollection, setSaveToCollection] = useState<string>("")
  const [saveName, setSaveName] = useState("")
  const [newCollectionName, setNewCollectionName] = useState("")
  const [isNewCollectionDialogOpen, setIsNewCollectionDialogOpen] = useState(false)

  // Update request URL
  const updateUrl = (url: string) => {
    updateRequest({
      ...request,
      url,
    })
  }

  // Update request method
  const updateMethod = (method: string) => {
    updateRequest({
      ...request,
      method,
    })
  }

  // Update request headers
  const updateHeaders = (headers: { key: string; value: string; enabled: boolean }[]) => {
    updateRequest({
      ...request,
      headers,
    })
  }

  // Update request params
  const updateParams = (params: { key: string; value: string; enabled: boolean }[]) => {
    updateRequest({
      ...request,
      params,
    })
  }

  // Update request body
  const updateBody = (mode: string, content: string) => {
    updateRequest({
      ...request,
      body: {
        mode,
        content,
      },
    })
  }

  const showCorsInfo = () => {
    return request.url.includes("localhost") || request.url.includes("127.0.0.1")
  }

  // Send the request
  const sendRequest = async () => {
    try {
      setIsSending(true)

      // Prepare URL with environment variables and query parameters
      let url = replaceEnvironmentVariables(request.url, environment.variables)

      // Add query parameters
      if (request.params && request.params.length > 0) {
        const enabledParams = request.params.filter((p) => p.enabled && p.key)
        if (enabledParams.length > 0) {
          const queryString = enabledParams
            .map(
              (p) =>
                `${encodeURIComponent(p.key)}=${encodeURIComponent(replaceEnvironmentVariables(p.value, environment.variables))}`,
            )
            .join("&")

          url += url.includes("?") ? `&${queryString}` : `?${queryString}`
        }
      }

      // Prepare headers
      const headers: Record<string, string> = {}
      if (request.headers && request.headers.length > 0) {
        request.headers.forEach((header) => {
          if (header.enabled && header.key) {
            headers[header.key] = replaceEnvironmentVariables(header.value, environment.variables)
          }
        })
      }

      // Prepare body
      let body = undefined
      if (request.method !== "GET" && request.method !== "HEAD") {
        if (request.body.mode === "json" && request.body.content) {
          headers["Content-Type"] = "application/json"
          try {
            // Replace environment variables in JSON
            const jsonWithVars = replaceEnvironmentVariables(request.body.content, environment.variables)
            // Validate JSON
            JSON.parse(jsonWithVars)
            body = jsonWithVars
          } catch (e) {
            // If invalid JSON, send as raw text
            body = request.body.content
          }
        } else if (request.body.mode === "text" && request.body.content) {
          headers["Content-Type"] = "text/plain"
          body = replaceEnvironmentVariables(request.body.content, environment.variables)
        } else if (request.body.mode === "form" && request.body.content) {
          // For form data, we'd need to implement FormData handling
          // This is simplified for now
          headers["Content-Type"] = "application/x-www-form-urlencoded"
          body = replaceEnvironmentVariables(request.body.content, environment.variables)
        }
      }

      // Record start time
      const startTime = Date.now()

      // Send the request
      const response = await fetch(url, {
        method: request.method,
        headers: {
          ...headers,
          // Add mode and credentials for better localhost support
          ...(url.includes("localhost") || url.includes("127.0.0.1")
            ? {
                "X-Requested-With": "XMLHttpRequest",
              }
            : {}),
        },
        body,
        // These options help with CORS for localhost
        mode: "cors",
        credentials: "same-origin",
      })

      // Calculate request duration
      const duration = Date.now() - startTime

      // Get response headers
      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      // Get response body
      let responseBody
      const contentType = response.headers.get("content-type") || ""

      if (contentType.includes("application/json")) {
        try {
          responseBody = await response.json()
        } catch (e) {
          responseBody = await response.text()
        }
      } else if (contentType.includes("text")) {
        responseBody = await response.text()
      } else {
        responseBody = await response.text()
      }

      // Create response object
      const responseData = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseBody,
        duration,
        size: JSON.stringify(responseBody).length,
        time: new Date().toISOString(),
      }

      updateResponse(responseData)
    } catch (error) {
      console.error("Request error:", error)
      updateResponse({
        error: true,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        time: new Date().toISOString(),
      })
    } finally {
      setIsSending(false)
    }
  }

  // Handle save request
  const handleSaveRequest = () => {
    if (saveToCollection && saveName) {
      saveRequest(saveToCollection, saveName)
      setIsSaveDialogOpen(false)
    }
  }

  // Create a new collection
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const id = createCollection(newCollectionName)
      setNewCollectionName("")
      setIsNewCollectionDialogOpen(false)
      setSaveToCollection(id)
    }
  }

  // Open save dialog
  const openSaveDialog = () => {
    setSaveName(request.name || "")
    setSaveToCollection(collections.length > 0 ? collections[0].id : "")
    setIsSaveDialogOpen(true)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center gap-2">
        <Select value={request.method} onValueChange={updateMethod}>
          <SelectTrigger className={`w-[100px] font-medium request-method-${request.method.toLowerCase()}`}>
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET" className="request-method-get font-medium">
              GET
            </SelectItem>
            <SelectItem value="POST" className="request-method-post font-medium">
              POST
            </SelectItem>
            <SelectItem value="PUT" className="request-method-put font-medium">
              PUT
            </SelectItem>
            <SelectItem value="DELETE" className="request-method-delete font-medium">
              DELETE
            </SelectItem>
            <SelectItem value="PATCH" className="request-method-patch font-medium">
              PATCH
            </SelectItem>
            <SelectItem value="HEAD">HEAD</SelectItem>
            <SelectItem value="OPTIONS">OPTIONS</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Enter request URL"
          value={request.url}
          onChange={(e) => updateUrl(e.target.value)}
          className="flex-1"
        />

        <Button onClick={sendRequest} disabled={isSending}>
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>

        <Button variant="outline" onClick={openSaveDialog}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="params" className="p-4">
          <TabsList>
            <TabsTrigger value="params">Params</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
          </TabsList>

          <TabsContent value="params" className="mt-4">
            <KeyValueEditor
              items={request.params || []}
              onChange={updateParams}
              keyPlaceholder="Parameter name"
              valuePlaceholder="Parameter value"
            />
          </TabsContent>

          <TabsContent value="headers" className="mt-4">
            <KeyValueEditor
              items={request.headers || []}
              onChange={updateHeaders}
              keyPlaceholder="Header name"
              valuePlaceholder="Header value"
            />
          </TabsContent>

          <TabsContent value="body" className="mt-4">
            <div className="mb-4">
              <Select
                value={request.body.mode}
                onValueChange={(value) => updateBody(value, request.body.content)}
                disabled={request.method === "GET" || request.method === "HEAD"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Body type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="form">Form</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {request.body.mode !== "none" && (
              <Textarea
                placeholder={
                  request.body.mode === "json"
                    ? "Enter JSON body"
                    : request.body.mode === "form"
                      ? "key=value&key2=value2"
                      : "Enter request body"
                }
                value={request.body.content}
                onChange={(e) => updateBody(request.body.mode, e.target.value)}
                className="min-h-[200px] font-mono"
                disabled={request.method === "GET" || request.method === "HEAD"}
              />
            )}
            {showCorsInfo() && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                <div className="font-medium text-blue-800 mb-1 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                  Localhost Request Detected
                </div>
                <p className="text-blue-700">
                  To make requests to localhost, ensure your server has CORS enabled. Add these headers to your server
                  response:
                </p>
                <pre className="mt-2 p-2 bg-blue-100 rounded text-xs overflow-x-auto">
                  Access-Control-Allow-Origin: *{"\n"}
                  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS{"\n"}
                  Access-Control-Allow-Headers: Content-Type, Authorization
                </pre>
              </div>
            )}
          </TabsContent>

          <TabsContent value="auth" className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              Authentication options will be implemented in a future version.
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>

      {/* Save Request Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Request</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Request Name</label>
              <Input placeholder="Request name" value={saveName} onChange={(e) => setSaveName(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Save to Collection</label>
              {collections.length > 0 ? (
                <Select value={saveToCollection} onValueChange={setSaveToCollection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground mb-2">No collections available</div>
              )}

              <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsNewCollectionDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRequest} disabled={!saveName || !saveToCollection}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Collection Dialog */}
      <Dialog open={isNewCollectionDialogOpen} onOpenChange={setIsNewCollectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateCollection()
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCollectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
