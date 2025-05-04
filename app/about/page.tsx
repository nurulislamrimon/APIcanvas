import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Github, Mail, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - APIcanvas",
  description: "Learn about APIcanvas and its creator, Nurul Islam Rimon.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-500 hover:underline mb-4 inline-block"
          >
            &larr; Back to APIcanvas
          </Link>
          <h1 className="text-4xl font-bold mb-4">About APIcanvas</h1>
          <p className="text-lg text-muted-foreground">
            A browser-based API testing tool created by Nurul Islam Rimon.
          </p>
        </div>

        <div className="space-y-8">
          <section className="border-b pb-6">
            <h2 className="text-2xl font-bold mb-4">What is APIcanvas?</h2>
            <p className="mb-4">
              APIcanvas is a powerful browser-based API testing tool that allows
              you to make HTTP requests to any API, including localhost, and
              save your requests and responses in the browser.
            </p>
            <p className="mb-4">
              Unlike other API clients, APIcanvas runs entirely in your browser,
              with no need for installation or servers. All data is stored
              locally in your browser using localStorage.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Key Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Make HTTP requests to any API, including localhost</li>
              <li>Save requests in collections for easy access</li>
              <li>Use environment variables to customize requests</li>
              <li>View request history</li>
              <li>Customize the application with settings</li>
              <li>No installation required - runs entirely in the browser</li>
              <li>All data is stored locally in your browser</li>
            </ul>
          </section>

          <section className="border-b pb-6">
            <h2 className="text-2xl font-bold mb-4">About the Creator</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <Image
                  src="https://sjc.microlink.io/enUMAFhUtYkhq4BW0m8uxmOvs_B-pcP91gC7nE2-j0LPOU9mBhibXr3gIA2WJPZ1mxAoj7RfRknpKUzb8AW5nA.jpeg"
                  alt="Nurul Islam Rimon"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Nurul Islam Rimon</h3>
                <p className="mb-4">
                  Nurul Islam Rimon is a full-stack developer with a passion for
                  creating tools that make developers' lives easier. He created
                  APIcanvas as an alternative to desktop API clients, with a
                  focus on simplicity, accessibility, and browser-based
                  functionality.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://github.com/nurulislamrimon"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="mailto:contact@nurulislamrimon.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://nurulislamrimon.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Website
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="pb-6">
            <h2 className="text-2xl font-bold mb-4">Project Goals</h2>
            <p className="mb-4">
              The main goal of APIcanvas is to provide a lightweight,
              browser-based alternative to desktop API clients like Postman or
              Insomnia. By running entirely in the browser, APIcanvas eliminates
              the need for installation and makes API testing accessible from
              any device with a web browser.
            </p>
            <p className="mb-4">
              APIcanvas is designed with the following principles in mind:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Simplicity:</strong> Focus on the core functionality of
                API testing without unnecessary complexity
              </li>
              <li>
                <strong>Accessibility:</strong> Make API testing available from
                any device with a web browser
              </li>
              <li>
                <strong>Privacy:</strong> Store all data locally in the browser,
                with no server-side storage
              </li>
              <li>
                <strong>Performance:</strong> Optimize for speed and
                responsiveness, even with large requests and responses
              </li>
              <li>
                <strong>Open Source:</strong> Make the code available for anyone
                to use, modify, and contribute to
              </li>
            </ul>
          </section>

          <section className="pb-6">
            <h2 className="text-2xl font-bold mb-4">Contributing</h2>
            <p className="mb-4">
              APIcanvas is an open source project, and contributions are
              welcome! If you'd like to contribute, please visit the{" "}
              <a
                href="https://github.com/nurulislamrimon/APIcanvas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                GitHub repository
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
  );
}
