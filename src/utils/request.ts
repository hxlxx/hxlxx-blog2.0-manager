import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { ResponseData } from '@/types'
import { logout, Message, MessageBox, Notify } from '@/utils'
import router from '@/router'
import { useUser } from '@/stores'

class HttpRequest {
  baseURL: string
  timeout: number
  queue: {
    [index: string]: boolean
  }
  // 防止多次显示提示框
  flag: boolean
  constructor() {
    this.baseURL = import.meta.env.VITE_BASE_URL
    this.timeout = 3000
    // 正在进行请求的请求列表
    this.queue = {}
    this.flag = true
  }

  setInterceptors(instance: AxiosInstance, url: string) {
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      if (url.indexOf('login') === -1) {
        const userStore = useUser()
        config.headers!['Authorization'] = userStore.getToken()
      }

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

  baseRequest(
    url: string,
    method: string,
    options?: AxiosRequestConfig
  ): Promise<ResponseData> {
    return this.request({
      url,
      method,
      ...options
    })
      .then((res) => {
        return Promise.resolve(res)
      })
      .catch((error) => {
        if (error.data.code === 401) {
          if (this.flag) {
            this.flag = false
            MessageBox({
              type: 'error',
              message: '身份已过期，请重新登录！',
              callback: () => {
                logout()
                router.push({ path: '/login' })
                this.flag = true
              }
            })
          }
        } else if (error.data.code === 403) {
          Notify({
            title: '操作失败',
            type: 'error',
            message: '权限不足！'
          })
        } else if (error.data.code === 418) {
          Notify({
            title: '登录失败',
            type: 'error',
            message: '该用户已被禁止登录！'
          })
        } else {
          Message({
            type: 'error',
            message: error?.data?.message || error
          })
        }
      }) as unknown as Promise<ResponseData>
  }

  get(url: string, options?: AxiosRequestConfig) {
    return this.baseRequest(url, 'GET', options)
  }

  post(url: string, options: AxiosRequestConfig) {
    return this.baseRequest(url, 'POST', options)
  }

  patch(url: string, options: AxiosRequestConfig) {
    return this.baseRequest(url, 'PATCH', options)
  }

  delete(url: string, options?: AxiosRequestConfig) {
    return this.baseRequest(url, 'DELETE', options)
  }
}

export default new HttpRequest()
