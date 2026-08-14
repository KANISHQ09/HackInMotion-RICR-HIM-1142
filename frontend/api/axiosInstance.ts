import axios, { AxiosError } from "axios"

export type SpendlyApiEnvelope<T> =
  | {
      success: true
      result: T
    }
  | {
      success: false
      errorMessage?: string
    }

export class SpendlyApiError extends Error {
  status?: number
  code?: string

  constructor(message: string, options: { status?: number; code?: string; cause?: unknown } = {}) {
    super(message)
    this.name = "SpendlyApiError"
    this.status = options.status
    this.code = options.code

    if (options.cause) {
      this.cause = options.cause
    }
  }
}

function getTimezoneOffsetHeader() {
  return String(-new Date().getTimezoneOffset())
}

function getTimezoneNameHeader() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
}

export function normalizeApiError(error: unknown) {
  if (error instanceof SpendlyApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<SpendlyApiEnvelope<unknown>>
    const message =
      axiosError.response?.data?.success === false
        ? axiosError.response.data.errorMessage || "Request failed"
        : axiosError.code === AxiosError.ERR_CANCELED || axiosError.code === "ECONNABORTED"
          ? "The backend took too long to respond. Please try again."
          : "Unable to reach the Spendly backend. Make sure the API server is running."

    return new SpendlyApiError(message, {
      status: axiosError.response?.status,
      code: axiosError.code,
      cause: error,
    })
  }

  return new SpendlyApiError(error instanceof Error ? error.message : "Request failed", {
    cause: error,
  })
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  timeout: 15_000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
})

axiosInstance.interceptors.request.use((config) => {
  config.headers.set("X-Timezone-Offset", getTimezoneOffsetHeader())
  config.headers.set("X-Timezone-Name", getTimezoneNameHeader())

  if (!(config.data instanceof FormData)) {
    config.headers.set("Content-Type", "application/json")
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error)),
)

export default axiosInstance
