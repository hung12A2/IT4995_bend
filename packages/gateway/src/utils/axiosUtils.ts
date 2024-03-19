import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { safeStringifyJson } from './json'

export const get = async <T>(
  client: AxiosInstance,
  path: string,
  config: AxiosRequestConfig = { headers: {}, responseType: 'json' },
): Promise<any> => {
  try {
    const resp = await client.get<T>(path, config)
    const { status, statusText, data } = resp
    return { status, statusText, data }
  } catch (error) {
    handleAxiosError(error) // throws an error
    throw error // never run this line, omit the error from typescript compiler
  }
}

export const post = async <T>(
  client: AxiosInstance,
  path: string,
  body: any,
  config: AxiosRequestConfig = { params: {}, headers: {} },
): Promise<any> => {
  try {
    const resp = await client.post<T>(path, body, config)
    const { status, statusText, data } = resp
    return { status, statusText, data }
  } catch (error) {
    handleAxiosError(error) // throws an error
    throw error // never run this line, omit the error from typescript compiler
  }
}

export const put = async <T>(
  client: AxiosInstance,
  path: string,
  body: any,
  config: AxiosRequestConfig = { params: {}, headers: {} },
): Promise<any> => {
  try {
    const resp = await client.put<T>(path, body, config)
    const { status, statusText, data } = resp
    return { status, statusText, data }
  } catch (error) {
    handleAxiosError(error) // throws an error
    throw error // never run this line, omit the error from typescript compiler
  }
}

export const patch = async <T>(
  client: AxiosInstance,
  path: string,
  body: any,
  config: AxiosRequestConfig = { params: {}, headers: {} },
): Promise<any> => {
  try {
    const resp = await client.patch<T>(path, body, config)
    const { status, statusText, data } = resp
    return { status, statusText, data }
  } catch (error) {
    handleAxiosError(error) // throws an error
    throw error // never run this line, omit the error from typescript compiler
  }
}

export const del = async <T>(
  client: AxiosInstance,
  path: string,
  config: AxiosRequestConfig = { params: {}, headers: {} },
): Promise<any> => {
  try {
    const resp = await client.delete<T>(path, config)
    const { status, statusText, data } = resp
    return { status, statusText, data }
  } catch (error) {
    handleAxiosError(error) // throws an error
    throw error // never run this line, omit the error from typescript compiler
  }
}

const handleAxiosError = (error: any) => {
  console.log('error.config', error.config)

  // The request was made and the server responded with a status code
  // that falls out of the range of 2xx
  if (error.response) {
    const responseDataStringified = safeStringifyJson(error.response.data) ?? ''

    console.log('error.response.data', responseDataStringified)
    console.log('error.response.status', error.response.status)
    console.log('error.response.headers', error.response.headers)

    if (error.response.data?.error) {
      throw error.response.data.error
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log('error.request', error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('error.message', error.message)
  }
}
