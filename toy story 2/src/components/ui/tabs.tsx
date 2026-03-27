// src/components/ui/tabs.tsx
import * as React from "react"

interface TabsProps {
    value: string
    onValueChange: (v: string) => void
    children: React.ReactNode
    className?: string
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
    return (
        <TabsProvider value={value} onValueChange={onValueChange}>
            <div className={className}>{children}</div>
        </TabsProvider>
    )
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={className}>{children}</div>
}

export function TabsTrigger({
    value,
    children,
    className,
}: {
    value: string
    children: React.ReactNode
    className?: string
}) {
    const { active, setActive } = React.useContext(TabsContext)
    const isActive = active === value
    return (
        <button
            onClick={() => setActive(value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${className || ''} ${isActive
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
        >
            {children}
        </button>
    )
}

export function TabsContent({
    value,
    children,
    className,
}: {
    value: string
    children: React.ReactNode
    className?: string
}) {
    const { active } = React.useContext(TabsContext)
    if (active !== value) return null
    return <div className={className || ''}>{children}</div>
}

// Context to share active tab state
interface TabsContextType {
    active: string
    setActive: (v: string) => void
}

const TabsContext = React.createContext<TabsContextType>({
    active: '',
    setActive: () => { }
})

function TabsProvider({
    value,
    onValueChange,
    children
}: {
    value: string
    onValueChange: (v: string) => void
    children: React.ReactNode
}) {
    const handleSetActive = (newValue: string) => {
        if (newValue !== value) {
            onValueChange(newValue)
        }
    }

    return (
        <TabsContext.Provider value={{ active: value, setActive: handleSetActive }}>
            {children}
        </TabsContext.Provider>
    )
}