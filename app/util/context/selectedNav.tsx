import { createContext, useState, useContext } from "react"

interface SelectedNavContext {
  selectedNav: "product" | "order";
  setSelectedNav: React.Dispatch<React.SetStateAction<"product" | "order">>;
}

const LocalStateContext = createContext<SelectedNavContext>({selectedNav: "product", setSelectedNav: ()=>{}})

export const SelectedNavStateProvider = ({children}: {children: any}) => {
    const [selectedNav, setSelectedNav] = useState<"product" | "order">("product")

    return (
        <LocalStateContext.Provider value={{ selectedNav, setSelectedNav }}>
          {children}
        </LocalStateContext.Provider>
      )
}

export const useSelectedNav = () => {
    const selectedNav = useContext(LocalStateContext)
    return selectedNav
}
