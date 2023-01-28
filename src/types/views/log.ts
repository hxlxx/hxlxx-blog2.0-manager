export type OperationLog = {
  id: number
  path: string
  request_type: string
  status_code: number
  username: string
  ip: string
  address: string
  updated_at: Date
  parameter: object
  response: object
}
