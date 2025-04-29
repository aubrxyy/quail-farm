


export default function Header() {
    return (
        <header className="bg-[#E6DCB8] w-full top-0 h-24 flex items-center justify-between px-40">
        <div className="flex items-center">
            <img src="/list.svg" alt="Menu" className="size-9" />
        </div>
        
        <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-36" />
            </div>
        <div className="flex items-center text-black">
            <div>Masuk</div>
            <div>Daftar</div>
        </div>
        </header>
    );
    }