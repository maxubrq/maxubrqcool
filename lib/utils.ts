import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cross-runtime Base64 helpers (browser + Node)
// Base64 for UTF-8 text
export function safeBtoaUtf8(text: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(text, 'utf8').toString('base64')
  }
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return (globalThis as any).btoa(binary)
}

export function safeAtobUtf8(b64: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(b64, 'base64').toString('utf8')
  }
  const binary = (globalThis as any).atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

// Base64 for raw binary strings (each char code is a byte 0-255)
export function safeBtoaBinary(binary: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(binary, 'binary').toString('base64')
  }
  return (globalThis as any).btoa(binary)
}

export function safeAtobToBinary(b64: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(b64, 'base64').toString('binary')
  }
  return (globalThis as any).atob(b64)
}
