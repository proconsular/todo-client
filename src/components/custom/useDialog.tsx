import { useCallback, useMemo, useState } from "react"
import { Dialog } from "./Dialog"

export const useDialog = (Component = Dialog): [(cb: () => void) => void, ({title, description} : { title?: string, description?: string }) => JSX.Element] => {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState<{ cb?: () => void }>({})
    const openDialog = useCallback((cb: () => void) => {
      setData({ cb })
      setOpen(true)
    }, [])
  
    // Using useMemo to reduce DOM re-renders
    const DialogComponent = useMemo(() => {
      const Comp = (props: { title?: string, description?: string }) => (
        <Component
          isOpen={open}
          {...props}
          onConfirm={() => {
            if (data.cb) {
              data.cb()
            }
            setOpen(false)
          }}
          onClose={() => setOpen(false)}
        />
      )
      return Comp
    }, [open, data, Component])
  
    return [openDialog, DialogComponent]
  }
  