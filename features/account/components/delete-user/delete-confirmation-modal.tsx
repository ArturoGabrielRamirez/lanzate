import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    reason,
    setReason,
    password,
    setPassword,
    isLoading
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    reason: string;
    setReason: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    isLoading: boolean;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-red-400">Confirmar eliminación</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
   
          <Alert className="bg-red-500/10 border-red-500/30">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-gray-300">
              <span className="font-semibold text-red-400">Advertencia:</span>{' '}
              Esta acción eliminará permanentemente tu cuenta después de 2 minutos.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-gray-300">
              Motivo de eliminación *
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explica por qué deseas eliminar tu cuenta (mínimo 10 caracteres)..."
              className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 resize-none focus:border-red-400"
              rows={3}
            />
            <p className="text-xs text-gray-400">
              {reason.length}/10 caracteres mínimos
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Contraseña actual *
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Confirma tu contraseña"
              className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-red-400"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading || reason.length < 10 || !password.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {isLoading ? 'Procesando...' : 'Confirmar eliminación'}
            </Button>
          </div>
        </div>
      </div>
    </div>
    );
};