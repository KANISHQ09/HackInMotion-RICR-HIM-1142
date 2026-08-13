export function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export function isCsvFile(file: File) {
  return file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")
}
