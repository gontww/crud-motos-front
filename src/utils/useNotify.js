import { getCurrentInstance } from 'vue'

export function useNotify() {
  const { proxy } = getCurrentInstance()
  return proxy.$notify
}
