import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export const FilterTabs = (
    {        
        filter, 
        setFilter, 
        tabs 
    } : { 
        filter: string, 
        setFilter: (value: string) => void, 
        tabs: {[key: string]: string}
    }
) => (
    <Tabs defaultValue={filter} onValueChange={setFilter} className="w-[400px]">
        <TabsList>
            {Object.keys(tabs).map((key) => (
                <TabsTrigger key={key} value={key}>{tabs[key]}</TabsTrigger>
            ))}
        </TabsList>
    </Tabs>
)