import Header from "./_components/header"

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col w-full h-fit min-h-full bg-back items-center">
            <div className="flex flex-col w-[95%] h-fit min-h-full">
                <Header/>
                <div className="p-5 bg-complement flex-1">
                    {children}
                </div>
            </div>
        </div>
    )
}