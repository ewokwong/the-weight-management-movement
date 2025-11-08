"use client"

import { useState } from "react"
import { Upload } from "lucide-react"

interface FileUploadProps {
  onUploadComplete?: (url: string) => void
  folder?: string
}

export default function FileUpload({ onUploadComplete, folder = "blog" }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUploadedUrl(data.url)
        if (onUploadComplete) {
          onUploadComplete(data.url)
        }
      } else {
        console.error("Upload failed")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <Upload className="w-4 h-4" />
        <span className="text-sm font-medium">
          {uploading ? "Uploading..." : "Upload File"}
        </span>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {uploadedUrl && (
        <div className="text-sm text-muted-foreground">
          <p>Uploaded: <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="underline">{uploadedUrl}</a></p>
        </div>
      )}
    </div>
  )
}

