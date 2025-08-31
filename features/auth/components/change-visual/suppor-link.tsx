export function SupportLink() {
    return (
        <div className="text-center mt-8">
            <p className="text-sm text-gray-400">
                ¿Problemas con el email?{" "}
                <a
                    href="mailto:soporte@lanzate.app"
                    className="text-blue-400 hover:text-blue-300 underline"
                >
                    Contacta soporte
                </a>
            </p>
        </div>
    );
}