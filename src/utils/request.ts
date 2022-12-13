import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Message } from './message'

class HttpRequest {
  baseURL: string
  timeout: number
  queue: {
    [index: string]: boolean
  }
  constructor() {
    this.baseURL =
      import.meta.env.MODE === 'production' ? import.meta.env.BASE_URL : ''
    this.timeout = 3000
    // 正在进行请求的请求列表
    this.queue = {}
  }

  setInterceptors(instance: AxiosInstance, url: string) {
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      // if (url.indexOf('/api') !== -1) {

      // }

      if (!Object.keys(this.queue).length) {
        // 此处开启 loading
      }
      this.queue[url] = true
      // 设置取消请求(将 controller 保存到全局，一旦调用就可以取消请求)
      const controller = new AbortController()
      config.signal = controller.signal
      return config
    })

    instance.interceptors.response.use(
      (res) => {
        // 一旦成功就从队列中删除该请求的标记
        delete this.queue[url]
        if (Object.keys(this.queue).length) {
          // 此处关闭 loading
        }
        return res.data
      },
      (error) => {
        // 一旦成功就从队列中删除该请求的标记
        delete this.queue[url]
        if (Object.keys(this.queue).length) {
          // 此处关闭 loading
        }
        return Promise.reject(error.response)
      }
    )
  }

  request(config: AxiosRequestConfig) {
    const instance = axios.create()
    config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      withCredentials: true,
      ...config
    }
    this.setInterceptors(instance, config.url as string)
    return instance(config)
  }

  get(url: string, { params, ...options }: any) {
    return this.request({
      url,
      method: 'GET',
      params,
      ...options
    })
      .then((res) => Promise.resolve(res))
      .catch((error) => {
        Message({
          type: 'error',
          message: error.data.message
        })
      })
  }

  post(url: string, { data, ...options }: any) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
      .then((res) => Promise.resolve(res))
      .catch((error) => {
        Message({
          type: 'error',
          message: error.data.message
        })
      })
  }

  patch(url: string, { data, ...options }: any) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
      .then((res) => Promise.resolve(res))
      .catch((error) => {
        Message({
          type: 'error',
          message: error.data.message
        })
      })
  }

  delete(url: string, { params, ...options }: any) {
    return this.request({
      url,
      method: 'DELETE',
      params,
      ...options
    })
      .then((res) => Promise.resolve(res))
      .catch((error) => {
        Message({
          type: 'error',
          message: error.data.message
        })
      })
  }
}

export default new HttpRequest()
