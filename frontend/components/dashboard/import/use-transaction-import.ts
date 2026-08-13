"use client"

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react"
import { importTransactions, type TransactionImportSummary } from "@/lib/api-client"
import {
  parseTransactionCsv,
  type TransactionCsvParseResult,
} from "@/components/dashboard/import/csv-parser"
import { formatFileSize, isCsvFile } from "@/components/dashboard/import/file-utils"
import { maxFileSize } from "@/components/dashboard/import/constants"

const emptyParseResult: TransactionCsvParseResult = {
  rows: [],
  rowsProcessed: 0,
  rowsReady: 0,
  rowsFailed: 0,
  duplicatesSkipped: 0,
  error: "",
}

export function useTransactionImport() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [parseResult, setParseResult] = useState<TransactionCsvParseResult>(emptyParseResult)
  const [importSummary, setImportSummary] = useState<TransactionImportSummary | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  const fileDetails = useMemo(() => {
    if (!file) return ""

    return `${formatFileSize(file.size)} CSV · ${parseResult.rowsReady} ready · ${parseResult.rowsFailed} needs review`
  }, [file, parseResult.rowsFailed, parseResult.rowsReady])

  const validateFile = useCallback(async (selectedFile?: File) => {
    setError("")
    setImportSummary(null)
    setParseResult(emptyParseResult)

    if (!selectedFile) return

    if (!isCsvFile(selectedFile)) {
      setFile(null)
      setError("Please select a CSV file.")
      return
    }

    if (selectedFile.size > maxFileSize) {
      setFile(null)
      setError("The selected file must be smaller than 10MB.")
      return
    }

    setFile(selectedFile)

    try {
      const text = await selectedFile.text()
      const parsed = parseTransactionCsv(text)
      setParseResult(parsed)

      if (parsed.error) {
        setError(parsed.error)
      }
    } catch {
      setError("Unable to read this CSV file. Please try another export.")
      setParseResult({
        ...emptyParseResult,
        rowsFailed: 1,
        error: "Unable to read this CSV file. Please try another export.",
      })
    }
  }, [])

  const openFilePicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)
      validateFile(event.dataTransfer.files[0])
    },
    [validateFile],
  )

  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget

    if (!(relatedTarget instanceof Node) || !event.currentTarget.contains(relatedTarget)) {
      setIsDragging(false)
    }
  }, [])

  const handleDropzoneKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        openFilePicker()
      }
    },
    [openFilePicker],
  )

  const clearFile = useCallback(() => {
    setFile(null)
    setError("")
    setParseResult(emptyParseResult)
    setImportSummary(null)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [])

  const submitImport = useCallback(async () => {
    if (!file) return

    setError("")
    setImportSummary(null)
    setIsImporting(true)

    try {
      const summary = await importTransactions(file)
      setImportSummary(summary)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to import this CSV file.")
    } finally {
      setIsImporting(false)
    }
  }, [file])

  return {
    inputRef,
    file,
    error,
    isDragging,
    fileDetails,
    importSummary,
    isImporting,
    parseResult,
    clearFile,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleDropzoneKeyDown,
    openFilePicker,
    submitImport,
    validateFile,
  }
}
