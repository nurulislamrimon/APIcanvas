"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Collection, Environment, Request } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Clock, FolderPlus, Plus, Save, Settings, Trash2 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateId } from "@/lib/utils"
import Image from "next/image"

interface SidebarProps {
  collections: Collection[]
  setCollections: (collections: Collection[]) => void
  environments: Environment[]
  setEnvironments: (environments: Environment[]) => void
  activeEnvironment: string
  setActiveEnvironment: (id: string) => void
  history: Request[]
  loadRequest: (request: Request) => void
  createCollection: (name: string) => string
  settings: Record<string, any>
  setSettings: (settings: Record<string, any>) => void
}

export default function Sidebar({
  collections,
  setCollections,
  environments,
  setEnvironments,
  activeEnvironment,
  setActiveEnvironment,
  history,
  loadRequest,
  createCollection,
  settings,
  setSettings,
}: SidebarProps) {
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newEnvironmentName, setNewEnvironmentName] = useState("")
  const [isNewCollectionDialogOpen, setIsNewCollectionDialogOpen] = useState(false)
  const [isNewEnvironmentDialogOpen, setIsNewEnvironmentDialogOpen] = useState(false)
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({})

  // Toggle collection expansion
  const toggleCollection = (id: string) => {
    setExpandedCollections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Create a new collection
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const id = createCollection(newCollectionName)
      setNewCollectionName("")
      setIsNewCollectionDialogOpen(false)
      setExpandedCollections((prev) => ({
        ...prev,
        [id]: true,
      }))
    }
  }

  // Create a new environment
  const handleCreateEnvironment = () => {
    if (newEnvironmentName.trim()) {
      const newEnv: Environment = {
        id: generateId(),
        name: newEnvironmentName,
        variables: {},
      }
      setEnvironments([...environments, newEnv])
      setNewEnvironmentName("")
      setIsNewEnvironmentDialogOpen(false)
    }
  }

  // Delete a collection
  const deleteCollection = (id: string) => {
    setCollections(collections.filter((c) => c.id !== id))
  }

  // Delete a request from a collection
  const deleteRequest = (collectionId: string, requestId: string) => {
    setCollections(
      collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              requests: collection.requests.filter((req) => req.id !== requestId),
            }
          : collection,
      ),
    )
  }

  return (
    <div className="h-full border-r flex flex-col">
      <div className="p-3 border-b bg-muted/40 flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="truncate">
                  {environments.find((env) => env.id === activeEnvironment)?.name || "Default"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {environments.map((env) => (
              <DropdownMenuItem
                key={env.id}
                onClick={() => setActiveEnvironment(env.id)}
                className={activeEnvironment === env.id ? "bg-muted" : ""}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {env.name}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={() => setIsNewEnvironmentDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Environment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="collections" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 p-0 h-10 bg-muted/40">
          <TabsTrigger value="collections" className="data-[state=active]:bg-background">
            Collections
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-background">
            History
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-background">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="flex-1 p-0 m-0">
          <div className="p-2 flex justify-between items-center">
            <span className="text-sm font-medium">Collections</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsNewCollectionDialogOpen(true)}>
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {collections.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">No collections yet</div>
              ) : (
                collections.map((collection) => (
                  <Collapsible
                    key={collection.id}
                    open={expandedCollections[collection.id]}
                    onOpenChange={() => toggleCollection(collection.id)}
                    className="mb-2"
                  >
                    <div className="flex items-center justify-between rounded-md hover:bg-muted p-2">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          {expandedCollections[collection.id] ? (
                            <ChevronDown className="h-4 w-4 mr-2" />
                          ) : (
                            <ChevronRight className="h-4 w-4 mr-2" />
                          )}
                        </Button>
                      </CollapsibleTrigger>

                      <span className="text-sm flex-1 truncate">{collection.name}</span>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => deleteCollection(collection.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <CollapsibleContent>
                      <div className="pl-6 mt-1">
                        {collection.requests.length === 0 ? (
                          <div className="text-xs text-muted-foreground py-1">No requests</div>
                        ) : (
                          collection.requests.map((request) => (
                            <div
                              key={request.id}
                              className="flex items-center justify-between rounded-md hover:bg-muted p-2 text-sm"
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start p-0 h-auto text-xs"
                                onClick={() => loadRequest(request)}
                              >
                                <span className="font-medium mr-2">{request.method}</span>
                                <span className="truncate">{request.name}</span>
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => deleteRequest(collection.id, request.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="history" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">History</span>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">No request history yet</div>
              ) : (
                history.map((request, index) => (
                  <div key={index} className="flex items-center justify-between rounded-md hover:bg-muted p-2 mb-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start p-0 h-auto"
                      onClick={() => loadRequest(request)}
                    >
                      <span className="font-medium mr-2 text-xs">{request.method}</span>
                      <span className="truncate text-xs">{request.url || "No URL"}</span>
                    </Button>

                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => loadRequest(request)}>
                      <Save className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="settings" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="flex items-center mb-4">
                <Settings className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Settings</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Theme</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={settings.theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, theme: "light" })}
                    >
                      Light
                    </Button>
                    <Button
                      variant={settings.theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, theme: "dark" })}
                    >
                      Dark
                    </Button>
                    <Button
                      variant={settings.theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, theme: "system" })}
                    >
                      System
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Font Size</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={settings.fontSize === "small" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, fontSize: "small" })}
                    >
                      Small
                    </Button>
                    <Button
                      variant={settings.fontSize === "medium" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, fontSize: "medium" })}
                    >
                      Medium
                    </Button>
                    <Button
                      variant={settings.fontSize === "large" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, fontSize: "large" })}
                    >
                      Large
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Auto Save</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={settings.autoSave ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, autoSave: true })}
                    >
                      On
                    </Button>
                    <Button
                      variant={!settings.autoSave ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, autoSave: false })}
                    >
                      Off
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Environments</h3>
                  {environments.map((env) => (
                    <div key={env.id} className="flex items-center justify-between rounded-md hover:bg-muted p-2 mb-1">
                      <span className="text-sm">{env.name}</span>

                      {env.id !== "default" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setEnvironments(environments.filter((e) => e.id !== env.id))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => setIsNewEnvironmentDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Environment
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src="https://sjc.microlink.io/enUMAFhUtYkhq4BW0m8uxmOvs_B-pcP91gC7nE2-j0LPOU9mBhibXr3gIA2WJPZ1mxAoj7RfRknpKUzb8AW5nA.jpeg"
                        alt="Nurul Islam Rimon"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">Nurul Islam Rimon</h3>
                      <p className="text-xs text-muted-foreground">Creator of APIcanvas</p>
                      <a
                        href="https://github.com/nurulislamrimon"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        @nurulislamrimon
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

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

      {/* New Environment Dialog */}
      <Dialog open={isNewEnvironmentDialogOpen} onOpenChange={setIsNewEnvironmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Environment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Environment name"
              value={newEnvironmentName}
              onChange={(e) => setNewEnvironmentName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateEnvironment()
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewEnvironmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEnvironment}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
