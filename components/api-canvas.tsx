"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import Sidebar from "@/components/sidebar"
import RequestPanel from "@/components/request-panel"
import ResponsePanel from "@/components/response-panel"
import type { Collection, Environment, Request, RequestTab } from "@/lib/types"
import { Plus, X, Menu, Github, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { generateId } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function APIcanvas() {
  const router = useRouter()
  // Load collections from localStorage
  const [collections, setCollections] = useLocalStorage<Collection[]>("apicanvas-collections", [])
  const [environments, setEnvironments] = useLocalStorage<Environment[]>("apicanvas-environments", [
    { id: "default", name: "Default", variables: {} },
  ])
  const [activeEnvironment, setActiveEnvironment] = useLocalStorage<string>("apicanvas-active-environment", "default")
  const [history, setHistory] = useLocalStorage<Request[]>("apicanvas-history", [])
  const [settings, setSettings] = useLocalStorage<Record<string, any>>("apicanvas-settings", {
    theme: "light",
    fontSize: "medium",
    autoSave: true,
  })

  // Tabs state
  const [tabs, setTabs] = useState<RequestTab[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)

  // Create a new tab with a default request
  const createNewTab = () => {
    // Prevent creating too many tabs if there's an issue
    if (tabs.length >= 20) return // Safety check to prevent infinite loops

    const newRequest: Request = {
      id: generateId(),
      name: "New Request",
      method: "GET",
      url: "",
      headers: [],
      params: [],
      body: {
        mode: "none",
        content: "",
      },
      auth: {
        type: "none",
        data: {},
      },
    }

    const newTab: RequestTab = {
      id: generateId(),
      request: newRequest,
      response: null,
      unsaved: true,
    }

    setTabs((prev) => [...prev, newTab])
    setActiveTab(newTab.id)
  }

  // Close a tab
  const closeTab = (tabId: string) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== tabId))
    if (activeTab === tabId) {
      const remainingTabs = tabs.filter((tab) => tab.id !== tabId)
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null)
    }
  }

  // Update request in a tab
  const updateRequest = (tabId: string, request: Request) => {
    setTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, request, unsaved: true } : tab)))
  }

  // Update response in a tab
  const updateResponse = (tabId: string, response: any) => {
    setTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, response } : tab)))

    // Add to history
    const tab = tabs.find((t) => t.id === tabId)
    if (tab) {
      const historyItem = {
        ...tab.request,
        timestamp: new Date().toISOString(),
      }
      setHistory((prev) => [historyItem, ...prev].slice(0, 50)) // Keep last 50 requests
    }
  }

  // Save request to a collection
  const saveRequest = (tabId: string, collectionId: string, name: string) => {
    const tab = tabs.find((t) => t.id === tabId)
    if (!tab) return

    const request = {
      ...tab.request,
      name,
    }

    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              requests: [...collection.requests, request],
            }
          : collection,
      ),
    )

    setTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, unsaved: false } : t)))
  }

  // Create a new collection
  const createCollection = (name: string) => {
    const newCollection: Collection = {
      id: generateId(),
      name,
      requests: [],
    }
    setCollections((prev) => [...prev, newCollection])
    return newCollection.id
  }

  // Load a saved request
  const loadRequest = (request: Request) => {
    const existingTab = tabs.find((tab) => tab.request.id === request.id)

    if (existingTab) {
      setActiveTab(existingTab.id)
    } else {
      const newTab: RequestTab = {
        id: generateId(),
        request: { ...request },
        response: null,
        unsaved: false,
      }

      setTabs((prev) => [...prev, newTab])
      setActiveTab(newTab.id)
    }
  }

  // Create a default tab if none exists
  useEffect(() => {
    if (tabs.length === 0) {
      createNewTab()
    }
  }, [tabs.length]) // Add proper dependency array

  // Get the active tab data
  const activeTabData = activeTab ? tabs.find((tab) => tab.id === activeTab) : null

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-white"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
            <path d="m15 5 4 4"></path>
          </svg>
          <h1 className="text-xl font-bold text-white">APIcanvas</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" asChild>
            <Link href="/docs">Documentation</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" asChild>
            <Link href="/settings">Settings</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/docs">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Documentation</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about">
                  <span>About</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://github.com/nurulislamrimon/APIcanvas" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <Sidebar
              collections={collections}
              setCollections={setCollections}
              environments={environments}
              setEnvironments={setEnvironments}
              activeEnvironment={activeEnvironment}
              setActiveEnvironment={setActiveEnvironment}
              history={history}
              loadRequest={loadRequest}
              createCollection={createCollection}
              settings={settings}
              setSettings={setSettings}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={80}>
            <div className="h-full flex flex-col">
              <div className="border-b flex items-center">
                <ScrollArea className="w-full">
                  <Tabs value={activeTab || ""} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-transparent h-10 p-0">
                      {tabs.map((tab) => (
                        <div key={tab.id} className="flex items-center">
                          <TabsTrigger
                            value={tab.id}
                            className="data-[state=active]:bg-muted rounded-none border-r px-4 h-10"
                          >
                            {tab.request.name}
                            {tab.unsaved && <span className="ml-1 text-muted-foreground">*</span>}
                          </TabsTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              closeTab(tab.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={createNewTab}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TabsList>
                  </Tabs>
                </ScrollArea>
              </div>

              <div className="flex-1 overflow-hidden">
                {activeTabData ? (
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50}>
                      <RequestPanel
                        request={activeTabData.request}
                        updateRequest={(request) => updateRequest(activeTabData.id, request)}
                        updateResponse={(response) => updateResponse(activeTabData.id, response)}
                        saveRequest={(collectionId, name) => saveRequest(activeTabData.id, collectionId, name)}
                        collections={collections}
                        createCollection={createCollection}
                        environment={environments.find((env) => env.id === activeEnvironment) || environments[0]}
                        settings={settings}
                      />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={50}>
                      <ResponsePanel response={activeTabData.response} settings={settings} />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
                    <div className="text-center max-w-md p-8 rounded-xl bg-background/80 backdrop-blur-sm shadow-lg border">
                      <div className="mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-8 w-8 text-primary"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                          <path d="m15 5 4 4"></path>
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Welcome to APIcanvas</h2>
                      <p className="text-muted-foreground mb-6">
                        Your browser-based API testing tool. Create a new request to get started.
                      </p>
                      <Button
                        onClick={createNewTab}
                        className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Request
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
