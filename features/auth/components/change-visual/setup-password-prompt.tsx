'use client'
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { Edit, Shield } from "lucide-react"
import { handleSetupPassword } from "../../actions/handle-setup-password"
import { newPasswordSchema } from "../../schemas/new-password-schema"

interface SetupPasswordPromptProps {
  operationName: string
  onPasswordSet?: () => void
}

export function SetupPasswordPrompt({ 
  operationName, 
  onPasswordSet 
}: SetupPasswordPromptProps) {
  
  async function setupPasswordAction(formData: {
    password: string;
    confirmPassword: string;
  }) {
    console.log('SetupPasswordPrompt - Iniciando acción', formData); // Debug
    
    const result = await handleSetupPassword(formData.password)
    
    console.log('SetupPasswordPrompt - Resultado:', result); // Debug
    
    if (!result.error && onPasswordSet) {
      onPasswordSet()
    }
    
    return result
  }

  return (
    <div>
      
      <ButtonWithPopup
        text={<Edit className="w-4 h-4" />}
        title="Configurar Contraseña de Seguridad"
        description={`Para ${operationName}, necesitas una contraseña como medida de seguridad adicional.`}
        action={setupPasswordAction}
        schema={newPasswordSchema}
        messages={{
          success: "Contraseña configurada correctamente",
          error: "Error al configurar la contraseña",
          loading: "Configurando contraseña..."
        }}
       /*  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl" */
        variant="default"
        onlyIcon={true}
      >
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-muted border border-border rounded-lg">
            <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-foreground font-medium text-sm mb-1">
                Información importante
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Esta contraseña se usará para confirmar cambios importantes.
                Seguirás pudiendo acceder con redes sociales.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <InputField
              name="password"
              label="Nueva Contraseña"
              type="password"
              placeholder="Introduce tu nueva contraseña"
            />
            <InputField
              name="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>
        </div>
      </ButtonWithPopup>
    </div>
  )
}