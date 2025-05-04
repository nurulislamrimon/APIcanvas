import APIcanvas from "@/components/api-canvas"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "APIcanvas - Browser-based API Testing Tool",
  description:
    "A powerful browser-based API testing tool that works with localhost requests and saves all data in the browser. Created by Nurul Islam Rimon.",
  keywords: ["API testing", "Postman alternative", "API client", "localhost API testing", "browser API tool"],
  authors: [{ name: "Nurul Islam Rimon", url: "https://github.com/nurulislamrimon" }],
  openGraph: {
    title: "APIcanvas - Browser-based API Testing Tool",
    description:
      "A powerful browser-based API testing tool that works with localhost requests and saves all data in the browser.",
    images: [
      {
        url: "https://sjc.microlink.io/enUMAFhUtYkhq4BW0m8uxmOvs_B-pcP91gC7nE2-j0LPOU9mBhibXr3gIA2WJPZ1mxAoj7RfRknpKUzb8AW5nA.jpeg",
      },
    ],
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <APIcanvas />
    </main>
  )
}
