import type { FormInstance } from 'antd'

// 公共错误处理方法
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleFormError = <T extends Record<string, any>>(
  form: FormInstance<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any
) => {
  if (err && typeof err === 'object') {
    if ('code' in err && err.code === 400 && 'metadata' in err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.keys(err.metadata as Record<string, any>).forEach(
        (key: string) => {
          form.setFields([
            {
              name: key,
              errors: [(err.metadata as Record<string, any>)[key]],
            },
          ])
        }
      )
    }
  }
}
