"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import {
  updatePersonalInfo,
  addSocialNetwork,
  updateSocialNetwork,
  deleteSocialNetwork,
  forceRevalidation,
} from "@/lib/actions/cv-actions";
import { PersonalInfo, SocialNetwork } from "@/types/cv";
import { CVEditorIcons } from "@/components/ui/icons/CVEditorIcons";
import { useCVPhoto } from "@/hooks/useCVPhoto";
import Image from "next/image";

interface PersonalInfoFormPrismaProps {
  initialData: PersonalInfo;
}

export const PersonalInfoFormPrisma: React.FC<PersonalInfoFormPrismaProps> = ({
  initialData,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Estados para el sistema de redes sociales
  const [newSocialNetwork, setNewSocialNetwork] = useState({
    name: "",
    url: "",
  });
  const [editingSocialNetwork, setEditingSocialNetwork] = useState<
    string | null
  >(null);
  const [editData, setEditData] = useState({ name: "", url: "" });

  // Estados para la foto del CV
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    photoUrl,
    isUploading,
    isDeleting,
    error: imageError,
    success: imageSuccess,
    uploadPhoto,
    deletePhoto,
  } = useCVPhoto(initialData.photo);

  // Handlers para la foto
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadPhoto(file);
    }
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteImage = () => {
    deletePhoto();
  };

  // Opciones predefinidas para redes sociales
  const socialNetworkOptions = [
    { value: "GitHub", label: "GitHub" },
    { value: "Twitter", label: "Twitter / X" },
    { value: "Instagram", label: "Instagram" },
    { value: "Facebook", label: "Facebook" },
    { value: "YouTube", label: "YouTube" },
    { value: "TikTok", label: "TikTok" },
    { value: "Behance", label: "Behance" },
    { value: "Dribbble", label: "Dribbble" },
    { value: "Dev.to", label: "Dev.to" },
    { value: "Medium", label: "Medium" },
    { value: "Stack Overflow", label: "Stack Overflow" },
    { value: "Discord", label: "Discord" },
    { value: "Telegram", label: "Telegram" },
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "Otro", label: "Otro" },
  ];

  // Función helper para obtener el icono correspondiente a la red social
  const getSocialIcon = (networkName: string) => {
    const iconMap: Record<
      string,
      React.ComponentType<{ size?: number; className?: string }>
    > = {
      GitHub: CVEditorIcons.GitHub,
      Twitter: CVEditorIcons.Twitter,
      Instagram: CVEditorIcons.Instagram,
      Facebook: CVEditorIcons.Facebook,
      YouTube: CVEditorIcons.YouTube,
      TikTok: CVEditorIcons.TikTok,
      Behance: CVEditorIcons.Behance,
      Dribbble: CVEditorIcons.Dribbble,
      "Dev.to": CVEditorIcons.DevTo,
      Medium: CVEditorIcons.Medium,
      "Stack Overflow": CVEditorIcons.StackOverflow,
      Discord: CVEditorIcons.Discord,
      Telegram: CVEditorIcons.Telegram,
      WhatsApp: CVEditorIcons.WhatsApp,
    };

    return iconMap[networkName] || CVEditorIcons.Web;
  };

  // Función helper para manejar actualizaciones suaves (patrón del Sidebar)
  const handleUpdate = async (
    updateFn: () => Promise<{ success: boolean; error?: string }>
  ): Promise<boolean> => {
    if (isUpdating) return false; // Prevenir múltiples actualizaciones simultáneas

    setIsUpdating(true);
    try {
      const result = await updateFn();
      if (result.success) {
        // Forzar revalidación y refresh suave
        await forceRevalidation();
        router.refresh();

        // Pequeño delay para permitir que los cambios se propaguen
        setTimeout(() => {
          setIsUpdating(false);
        }, 500);

        return true;
      } else {
        console.error("Operation failed:", result.error);
        setIsUpdating(false);

        // Si es un error de registro no encontrado, puede ser normal (ya eliminado)
        if (result.error?.includes("No record was found")) {
          return true; // Considerar como éxito porque el objetivo (eliminar) ya se cumplió
        }

        return false;
      }
    } catch (error) {
      console.error("Error updating:", error);
      setIsUpdating(false);

      // Si es un error de Prisma de registro no encontrado, tratarlo como éxito
      if (
        error instanceof Error &&
        error.message.includes("No record was found")
      ) {
        return true;
      }

      // En caso de error crítico, hacer refresh completo como fallback
      window.location.reload();
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await handleUpdate(() =>
      updatePersonalInfo({
        name: formData.name,
        position: formData.position,
        phone: formData.phone,
        email: formData.email,
        linkedin: formData.linkedin,
        website: formData.website,
        location: formData.location,
      })
    );

    if (success) {
      console.log("Personal info updated successfully");
    } else {
      console.error("Error updating personal info");
    }

    setIsLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSocialNetwork = async () => {
    if (!newSocialNetwork.name || !newSocialNetwork.url) return;

    // Añadir temporalmente para feedback inmediato
    const tempId = `temp-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      socialNetworks: [
        ...prev.socialNetworks,
        {
          id: tempId,
          name: newSocialNetwork.name,
          url: newSocialNetwork.url,
        },
      ],
    }));

    const success = await handleUpdate(() =>
      addSocialNetwork(newSocialNetwork)
    );

    if (success) {
      setNewSocialNetwork({ name: "", url: "" });
      // El refresh del handleUpdate traerá los datos actualizados con IDs reales
    } else {
      // Revertir el cambio local si falló
      setFormData((prev) => ({
        ...prev,
        socialNetworks: prev.socialNetworks.filter((sn) => sn.id !== tempId),
      }));

      // El error se maneja en handleUpdate, pero podemos mostrar mensaje específico
      const result = await addSocialNetwork(newSocialNetwork);
      if (result.error === "Maximum 5 social networks allowed") {
        alert("Máximo 5 redes sociales permitidas");
      } else {
        alert("Error al añadir red social");
      }
    }
  };

  const handleEditSocialNetwork = async (socialNetwork: SocialNetwork) => {
    // Si es un ID temporal, solo actualizar el estado local
    if (socialNetwork.id.startsWith("temp-")) {
      setFormData((prev) => ({
        ...prev,
        socialNetworks: prev.socialNetworks.map((sn) =>
          sn.id === socialNetwork.id ? socialNetwork : sn
        ),
      }));
      setEditingSocialNetwork(null);
      return;
    }

    // Actualizar optimistamente en el estado local
    const originalSocialNetworks = formData.socialNetworks;
    setFormData((prev) => ({
      ...prev,
      socialNetworks: prev.socialNetworks.map((sn) =>
        sn.id === socialNetwork.id ? socialNetwork : sn
      ),
    }));

    const success = await handleUpdate(() =>
      updateSocialNetwork(socialNetwork)
    );

    if (success) {
      setEditingSocialNetwork(null);
      // El refresh del handleUpdate traerá los datos actualizados
    } else {
      // Revertir el cambio si falló
      setFormData((prev) => ({
        ...prev,
        socialNetworks: originalSocialNetworks,
      }));
      alert("Error al actualizar red social");
    }
  };

  const handleDeleteSocialNetwork = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta red social?"))
      return;

    // Si es un ID temporal, solo eliminar del estado local
    if (id.startsWith("temp-")) {
      setFormData((prev) => ({
        ...prev,
        socialNetworks: prev.socialNetworks.filter((sn) => sn.id !== id),
      }));
      return;
    }

    // Eliminar optimistamente del estado local para feedback inmediato
    const originalSocialNetworks = formData.socialNetworks;
    setFormData((prev) => ({
      ...prev,
      socialNetworks: prev.socialNetworks.filter((sn) => sn.id !== id),
    }));

    const success = await handleUpdate(() => deleteSocialNetwork(id));

    if (!success) {
      // Revertir el cambio si falló
      setFormData((prev) => ({
        ...prev,
        socialNetworks: originalSocialNetworks,
      }));
      alert("Error al eliminar red social");
    }
    // Si tuvo éxito, el refresh del handleUpdate traerá los datos actualizados
  };

  const startEditing = (socialNetwork: SocialNetwork) => {
    setEditingSocialNetwork(socialNetwork.id);
    setEditData({ name: socialNetwork.name, url: socialNetwork.url });
  };

  const saveEdit = () => {
    if (editingSocialNetwork) {
      handleEditSocialNetwork({
        id: editingSocialNetwork,
        name: editData.name,
        url: editData.url,
      });
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Información Personal
      </h3>

      {/* Sección de Foto del CV */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
          Foto de Perfil
        </h4>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar Container */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt="Foto de perfil"
                  className="w-16 sm:w-20 h-16 sm:h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                  width={80}
                  height={80}
                  unoptimized
                />
              ) : (
                <div className="w-16 sm:w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                  {formData.name
                    ? formData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "CV"}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleFileInputClick}
                disabled={isUploading}
              >
                {isUploading ? "Subiendo..." : "Cambiar foto"}
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteImage}
                disabled={isDeleting || !photoUrl}
              >
                {isDeleting ? "Eliminando..." : "Eliminar foto"}
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center sm:text-left">
            <h5 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Foto del CV
            </h5>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3">
              Sube una imagen que te represente. Máximo 5MB, formatos: JPG, PNG.
            </p>

            {/* Mensajes de estado */}
            {(imageError || imageSuccess) && (
              <div
                className={`mt-3 rounded text-xs ${
                  imageError
                    ? "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                    : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                }`}
              >
                {imageError || imageSuccess}
              </div>
            )}
          </div>
        </div>

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Indicador de actualización global */}
      {isUpdating && (
        <div className="mb-4 flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm font-medium">
              Actualizando información...
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre completo"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            disabled={isUpdating}
          />
          <Input
            label="Puesto objetivo"
            value={formData.position}
            onChange={(e) => handleChange("position", e.target.value)}
            required
            disabled={isUpdating}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Teléfono"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
            disabled={isUpdating}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            disabled={isUpdating}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="LinkedIn"
            value={formData.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="https://www.linkedin.com/in/tu-perfil"
            disabled={isUpdating}
          />
          <Input
            label="Sitio web"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://tu-sitio-web.com"
            disabled={isUpdating}
          />
        </div>

        <Input
          label="Ubicación"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="Ciudad, País"
          disabled={isUpdating}
        />

        <Button type="submit" disabled={isLoading || isUpdating}>
          {isLoading ? "Actualizando..." : "Actualizar información personal"}
        </Button>
      </form>

      {/* Sección de Redes Sociales */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          Redes Sociales ({formData.socialNetworks.length}/5)
        </h4>

        {/* Lista de redes sociales existentes */}
        {formData.socialNetworks.length > 0 && (
          <div className="space-y-3 mb-4">
            {formData.socialNetworks.map((sn) => (
              <div
                key={sn.id}
                className="flex flex-col md:flex-row border border-gray-200 dark:border-gray-600 gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                {editingSocialNetwork === sn.id ? (
                  <>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Select
                        value={editData.name}
                        onChange={(value) =>
                          setEditData((prev) => ({
                            ...prev,
                            name: value,
                          }))
                        }
                        options={[
                          { value: "", label: "Selecciona red social" },
                          ...socialNetworkOptions,
                        ]}
                        disabled={isUpdating}
                      />
                      <Input
                        value={editData.url}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        placeholder="URL de tu perfil"
                        disabled={isUpdating}
                      />
                    </div>
                    <Button
                      onClick={saveEdit}
                      disabled={isUpdating}
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <CVEditorIcons.Save size={14} />
                      Guardar
                    </Button>
                    <Button
                      onClick={() => setEditingSocialNetwork(null)}
                      variant="secondary"
                      size="sm"
                      disabled={isUpdating}
                      className="flex items-center gap-1"
                    >
                      <CVEditorIcons.Delete size={14} />
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        {(() => {
                          const IconComponent = getSocialIcon(sn.name);
                          return <IconComponent size={16} />;
                        })()}
                        {socialNetworkOptions.find(
                          (opt) => opt.value === sn.name
                        )?.label || sn.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 break-all">
                        {sn.url}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => startEditing(sn)}
                        disabled={isUpdating}
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <CVEditorIcons.Write size={14} />
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteSocialNetwork(sn.id)}
                        disabled={isUpdating}
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <CVEditorIcons.Delete size={14} />
                        Eliminar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Formulario para añadir nueva red social */}
        {formData.socialNetworks.length < 5 && (
          <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
            <h5 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <CVEditorIcons.Add size={16} />
              Añadir Red Social
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Select
                value={newSocialNetwork.name}
                onChange={(value) =>
                  setNewSocialNetwork((prev) => ({
                    ...prev,
                    name: value,
                  }))
                }
                options={[
                  { value: "", label: "Selecciona red social" },
                  ...socialNetworkOptions,
                ]}
                disabled={isUpdating}
              />
              <Input
                value={newSocialNetwork.url}
                onChange={(e) =>
                  setNewSocialNetwork((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
                placeholder="URL de tu perfil"
                disabled={isUpdating}
              />
            </div>

            {/* Campo personalizado si selecciona "Otro" */}
            {newSocialNetwork.name === "Otro" && (
              <Input
                value={
                  newSocialNetwork.name === "Otro" ? "" : newSocialNetwork.name
                }
                onChange={(e) =>
                  setNewSocialNetwork((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Nombre de la red social"
                disabled={isUpdating}
              />
            )}

            <Button
              onClick={handleAddSocialNetwork}
              disabled={
                !newSocialNetwork.name || !newSocialNetwork.url || isUpdating
              }
              variant="secondary"
              size="sm"
              className="flex items-center gap-1 w-auto min-w-fit"
            >
              {isUpdating ? (
                "Añadiendo..."
              ) : (
                <span className="flex items-center gap-1">
                  <CVEditorIcons.Add size={14} />
                  Añadir Red Social
                </span>
              )}
            </Button>
          </div>
        )}

        {formData.socialNetworks.length >= 5 && (
          <p className="text-sm text-orange-600 dark:text-orange-400">
            Has alcanzado el límite máximo de 5 redes sociales.
          </p>
        )}
      </div>
    </Card>
  );
};
