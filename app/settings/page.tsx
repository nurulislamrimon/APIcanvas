"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KeyValueEditor } from "@/components/key-value-editor"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Trash2, Plus } from "lucide-react"
import { generateId } from "@/lib/utils"

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<Record<string, any>>("apicanvas-settings", {
    theme: "light",
    fontSize: "medium",
    autoSave: true,
    defaultMethod: "GET",
    timeout: 30000,
  })

  const [environments, setEnvironments] = useLocalStorage<Array<any>>("apicanvas-environments", [
    { id: "default", name: "Default", variables: {} },
  ])

  const [activeEnvironment, setActiveEnvironment] = useLocalStorage<string>("apicanvas-active-environment", "default")
  const [activeEnvVars, setActiveEnvVars] = useState<{ key: string; value: string; enabled: boolean }[]>([])

  // Load environment variables when active environment changes
  useEffect(() => {
    const env = environments.find((e) => e.id === activeEnvironment)
    if (env) {
      const vars = Object.entries(env.variables || {}).map(([key, value]) => ({
        key,
        value: value as string,
        enabled: true,
      }))
      setActiveEnvVars(vars.length > 0 ? vars : [{ key: "", value: "", enabled: true }])
    }
  }, [activeEnvironment, environments])

  // Update environment variables
  const updateEnvironmentVariables = (items: { key: string; value: string; enabled: boolean }[]) => {
    setActiveEnvVars(items)

    const variables: Record<string, string> = {}
    items.forEach((item) => {
      if (item.key && item.enabled) {
        variables[item.key] = item.value
      }
    })

    setEnvironments(environments.map((env) => (env.id === activeEnvironment ? { ...env, variables } : env)))
  }

  // Create a new environment
  const createEnvironment = () => {
    const newEnv = {
      id: generateId(),
      name: `Environment ${environments.length + 1}`,
      variables: {},
    }
    setEnvironments([...environments, newEnv])
    setActiveEnvironment(newEnv.id)
  }

  // Delete an environment
  const deleteEnvironment = (id: string) => {
    if (id === "default") return // Don't delete default environment
    setEnvironments(environments.filter((env) => env.id !== id))
    if (activeEnvironment === id) {
      setActiveEnvironment("default")
    }
  }

  // Rename environment
  const renameEnvironment = (id: string, name: string) => {
    setEnvironments(environments.map((env) => (env.id === id ? { ...env, name } : env)))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
            &larr; Back to APIcanvas
          </Link>
          <h1 className="text-4xl font-bold mb-4">Settings</h1>
          <p className="text-lg text-muted-foreground">Configure APIcanvas to suit your preferences.</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="environments">Environments</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure the appearance and behavior of APIcanvas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select
                    value={settings.fontSize}
                    onValueChange={(value) => setSettings({ ...settings, fontSize: value })}
                  >
                    <SelectTrigger id="fontSize">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="autoSave">Auto Save Requests</Label>
                  <Switch
                    id="autoSave"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultMethod">Default HTTP Method</Label>
                  <Select
                    value={settings.defaultMethod}
                    onValueChange={(value) => setSettings({ ...settings, defaultMethod: value })}
                  >
                    <SelectTrigger id="defaultMethod">
                      <SelectValue placeholder="Select default method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environments">
            <Card>
              <CardHeader>
                <CardTitle>Environment Management</CardTitle>
                <CardDescription>
                  Create and manage environments with variables that can be used in your requests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Active Environment</Label>
                  <div className="flex gap-2">
                    <Select value={activeEnvironment} onValueChange={setActiveEnvironment}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        {environments.map((env) => (
                          <SelectItem key={env.id} value={env.id}>
                            {env.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={createEnvironment}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="envName">Environment Name</Label>
                    {activeEnvironment !== "default" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteEnvironment(activeEnvironment)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                  <Input
                    id="envName"
                    value={environments.find((env) => env.id === activeEnvironment)?.name || ""}
                    onChange={(e) => renameEnvironment(activeEnvironment, e.target.value)}
                    disabled={activeEnvironment === "default"}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Environment Variables</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Use these variables in your requests with the syntax <code>{"{{variableName}}"}</code>
                  </p>
                  <KeyValueEditor
                    items={activeEnvVars}
                    onChange={updateEnvironmentVariables}
                    keyPlaceholder="Variable name"
                    valuePlaceholder="Variable value"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure advanced options for APIcanvas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="timeout">Request Timeout (ms)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={settings.timeout || 30000}
                    onChange={(e) => setSettings({ ...settings, timeout: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum time to wait for a response before timing out (in milliseconds)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Data Management</Label>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="justify-start">
                      Export All Data
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Import Data
                    </Button>
                    <Button variant="outline" className="justify-start text-red-500">
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button asChild>
            <Link href="/">Return to APIcanvas</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
