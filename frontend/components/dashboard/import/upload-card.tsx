import { memo, type DragEvent, type KeyboardEvent, type RefObject } from "react"
import { Info, UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

type UploadCardProps = {
  inputRef: RefObject<HTMLInputElement | null>
  file: File | null
  error: string
  isDragging: boolean
  fileDetails: string
  handleDrop: (event: DragEvent<HTMLDivElement>) => void
  handleDragEnter: (event: DragEvent<HTMLDivElement>) => void
  handleDragOver: (event: DragEvent<HTMLDivElement>) => void
  handleDragLeave: (event: DragEvent<HTMLDivElement>) => void
  handleDropzoneKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
  openFilePicker: () => void
  validateFile: (file?: File) => void | Promise<void>
}

export const UploadCard = memo(function UploadCard({
  inputRef,
  file,
  error,
  isDragging,
  fileDetails,
  handleDrop,
  handleDragEnter,
  handleDragOver,
  handleDragLeave,
  handleDropzoneKeyDown,
  openFilePicker,
  validateFile,
}: UploadCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200/80 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition hover:shadow-[0_16px_44px_rgba(0,0,0,0.06)] md:p-6">
      <div
        className={cn(
          "relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-zinc-300/80 bg-[#f7f3f2]/70 p-7 text-center outline-none transition md:min-h-[300px] md:p-12",
          isDragging && "border-zinc-950 bg-[#f1edec]",
          file && "border-emerald-700 bg-emerald-50",
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        onKeyDown={handleDropzoneKeyDown}
        role="button"
        tabIndex={0}
        aria-describedby="upload-help upload-status"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={(event) => validateFile(event.target.files?.[0])}
          tabIndex={-1}
          aria-hidden="true"
        />

        <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-zinc-950 shadow-sm transition group-hover:scale-105">
          <UploadCloud className="h-8 w-8" aria-hidden="true" />
        </div>

        <div>
          <h2 className="font-serif text-2xl font-medium tracking-normal text-zinc-950">
            {file ? "File ready to import" : "Select a file to upload"}
          </h2>
          <p id="upload-status" className="mx-auto mt-2 max-w-md break-words text-base leading-6 text-zinc-600">
            {file ? file.name : "Drag and drop your CSV bank statement here or click to browse."}
          </p>
          {fileDetails && (
            <p className="mt-2 break-words text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700">
              {fileDetails}
            </p>
          )}
        </div>

        <p
          id="upload-help"
          className="mt-1 inline-flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500"
        >
          <Info className="h-4 w-4" aria-hidden="true" />
          Maximum file size: 5MB. Supported format: CSV.
        </p>

        {error && (
          <p className="text-sm font-semibold text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
})
