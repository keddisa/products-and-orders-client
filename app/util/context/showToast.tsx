import { ToastMessage } from "@/app/types";
import { createContext, useState, useContext } from "react"

interface ShowToastContext {
  showToast: ToastMessage;
  setShowToast: React.Dispatch<React.SetStateAction<ToastMessage>>;
}

const LocalStateContext = createContext<ShowToastContext>({showToast: {showMessage: false}, setShowToast: ()=>{}})

export const ShowToastStateProvider = ({children}: {children: any}) => {
    const [showToast, setShowToast] = useState<ToastMessage>({showMessage: false})

    return (
      <LocalStateContext.Provider value={{ showToast, setShowToast }}>
        {children}
      </LocalStateContext.Provider>
    )
}

export const useShowToast = () => {
    const showToast = useContext(LocalStateContext)
    return showToast
}
