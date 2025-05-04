export interface Request {
  id: string
  name: string
  method: string
  url: string
  headers: { key: string; value: string; enabled: boolean }[]
  params: { key: string; value: string; enabled: boolean }[]
  body: {
    mode: string
    content: string
  }
  auth: {
    type: string
    data: Record<string, any>
  }
  timestamp?: string
}

export interface Collection {
  id: string
  name: string
  requests: Request[]
}

export interface Environment {
  id: string
  name: string
  variables: Record<string, string>
}

export interface RequestTab {
  id: string
  request: Request
  response: any
  unsaved: boolean
}
