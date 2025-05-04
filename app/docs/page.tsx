import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation - APIcanvas",
  description: "Learn how to use APIcanvas, a browser-based API testing tool.",
}

export default function DocsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
            &larr; Back to APIcanvas
          </Link>
          <h1 className="text-4xl font-bold mb-4">APIcanvas Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Learn how to use APIcanvas, a browser-based API testing tool created by Nurul Islam Rimon.
          </p>
        </div>

        <div className="space-y-8">
          <section id="getting-started" className="border-b pb-6">
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <p className="mb-4">
              APIcanvas is a browser-based API testing tool that allows you to make HTTP requests to any API, including
              localhost, and save your requests and responses in the browser.
            </p>
            <p className="mb-4">
              Unlike other API clients, APIcanvas runs entirely in your browser, with no need for installation or
              servers. All data is stored locally in your browser.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Key Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Make HTTP requests to any API, including localhost</li>
              <li>Save requests in collections for easy access</li>
              <li>Use environment variables to customize requests</li>
              <li>View request history</li>
              <li>Customize the application with settings</li>
            </ul>
          </section>

          <section id="making-requests" className="border-b pb-6">
            <h2 className="text-2xl font-bold mb-4">Making Requests</h2>
            <p className="mb-4">
              To make a request, enter the URL in the URL field, select the HTTP method, and click the Send button.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Request Options</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Method:</strong> Select the HTTP method (GET, POST, PUT, DELETE, etc.)
              </li>
              <li>
                <strong>URL:</strong> Enter the URL of the API endpoint
              </li>
              <li>
                <strong>Params:</strong> Add query parameters to the URL
              </li>
              <li>
                <strong>Headers:</strong> Add HTTP headers to the request
              </li>
              <li>
                <strong>Body:</strong> Add a request body (for POST, PUT, PATCH methods)
              </li>
            </ul>
          </section>

          <section id="localhost-requests" className="border-b pb-6">
            <h2 className="text-2xl font-bold mb-4">Localhost Requests</h2>
            <p className="mb-4">
              APIcanvas supports making requests to localhost servers. However, due to browser security restrictions,
              you may need to configure your server to allow cross-origin requests.
            </p>
            <p className="mb-4">Add the following headers to your server responses:</p>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              Access-Control-Allow-Origin: *{"\n"}
              Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS{"\n"}
              Access-Control-Allow-Headers: Content-Type, Authorization
            </pre>
          </section>

          <section id="collections" className="border-b pb-6">
            <h2 className="text-2xl font-bold mb-4">Collections</h2>
            <p className="mb-4">
              Collections allow you to organize your requests. You can create multiple collections and add requests to
              them.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Managing Collections</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Click the + button in the Collections tab to create a new collection</li>
              <li>Click the Save button after making a request to save it to a collection</li>
              <li>Click on a saved request to load it</li>
              <li>Click the trash icon to delete a collection or request</li>
            </ul>
          </section>

          <section id="environments" className="border-b pb-6">
            <h2 className="text-2xl font-bold mb-4">Environments</h2>
            <p className="mb-4">
              Environments allow you to define variables that can be used in your requests. This is useful for switching
              between different API endpoints or authentication tokens.
            </p>
            <p className="mb-4">
              Use the <code>{"{{variableName}}"}</code> syntax in your URLs, headers, or body to reference environment
              variables.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Managing Environments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Click the environment dropdown at the top of the sidebar to select an environment</li>
              <li>Click "New Environment" to create a new environment</li>
              <li>Go to the Settings tab to manage environment variables</li>
            </ul>
          </section>

          <section id="settings" className="border-b pb-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="mb-4">
              APIcanvas allows you to customize various aspects of the application through the Settings tab.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Available Settings</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Theme:</strong> Choose between light, dark, or system theme
              </li>
              <li>
                <strong>Font Size:</strong> Adjust the font size for better readability
              </li>
              <li>
                <strong>Auto Save:</strong> Enable or disable automatic saving of requests
              </li>
            </ul>
          </section>

          <section id="about" className="pb-6">
            <h2 className="text-2xl font-bold mb-4">About APIcanvas</h2>
            <p className="mb-4">
              APIcanvas was created by{" "}
              <a
                href="https://github.com/nurulislamrimon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Nurul Islam Rimon
              </a>{" "}
              as a browser-based alternative to desktop API clients.
            </p>
            <p className="mb-4">
              The application is open source and available on{" "}
              <a
                href="https://github.com/nurulislamrimon/APIcanvas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                GitHub
              </a>
              .
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/">Return to APIcanvas</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
