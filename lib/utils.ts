import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function formatBytes(bytes: number) {
  if (!bytes) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function replaceEnvironmentVariables(text: string, variables: Record<string, string>) {
  if (!text) return text

  // Replace {{variableName}} with the variable value
  return text.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    return variables[variableName.trim()] || match
  })
}

// Add this function to the utils.ts file
export function handleLocalhost(url: string) {
  // Check if the URL is a localhost URL
  const isLocalhost = url.includes("localhost") || url.includes("127.0.0.1")

  if (isLocalhost) {
    // Return special headers and options for localhost requests
    return {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      options: {
        mode: "cors" as RequestMode,
        credentials: "same-origin" as RequestCredentials,
      },
    }
  }

  return {
    headers: {},
    options: {},
  }
}
