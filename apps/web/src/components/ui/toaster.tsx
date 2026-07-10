import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="top-center"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'group toast !bg-ink-900 !border-border !text-ink-50 shadow-[0_8px_30px_rgba(0,0,0,0.45)]',
          title: 'text-sm font-medium !text-ink-50',
          description: 'text-sm !text-ink-400',
          actionButton: '!bg-iris-500 !text-white text-xs font-medium',
          cancelButton: '!bg-ink-800 !text-ink-200 text-xs font-medium',
          closeButton:
            '!bg-ink-800 !border-border !text-ink-300 hover:!text-ink-50',
          success: '!border-success/40',
          error: '!border-error/40',
          warning: '!border-warning/40',
          info: '!border-info/40',
        },
      }}
    />
  )
}
