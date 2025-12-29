export function LoadingState() {
    return (
        <div className="p-8 text-center grow --color-background text-white flex flex-col items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p>Verificando estado del email...</p>
        </div>
    );
}