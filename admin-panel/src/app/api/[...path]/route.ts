/**
 * API Proxy Route
 *
 * Proxies all /api/* requests to the backend at batterydoctor.elvee.app/api/*
 * This avoids CORS issues and ensures all headers (env, x-device) are forwarded.
 *
 * Why not use next.config.ts rewrites?
 * - Rewrites don't forward custom headers reliably
 * - This gives full control over request/response transformation
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://batterydoctor.elvee.app/api";

async function proxyRequest(request: NextRequest) {
  // Build the backend URL from the path
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, ""); // Remove /api prefix
  const backendUrl = `${BACKEND_URL}${path}${url.search}`;

  // Forward all headers from the original request
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    // Skip host and other headers that shouldn't be forwarded
    if (!["host", "connection", "content-length"].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  // Ensure required headers are always present
  if (!headers.has("env")) {
    headers.set("env", "test");
  }
  if (!headers.has("x-device")) {
    headers.set("x-device", "web");
  }

  // Build fetch options
  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };

  // Forward body for POST/PUT/PATCH requests
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // For file uploads, forward the raw body
      fetchOptions.body = await request.arrayBuffer();
    } else {
      // For JSON, forward as text
      fetchOptions.body = await request.text();
    }
  }

  try {
    const response = await fetch(backendUrl, fetchOptions);

    // Get response body
    const responseBody = await response.arrayBuffer();

    // Forward response with all headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Skip headers that Next.js handles
      if (!["transfer-encoding", "connection"].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { message: "Failed to connect to backend API" },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request);
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request);
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request);
}
