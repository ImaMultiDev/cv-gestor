"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { usePathname } from "next/navigation";
import { ConfiguredIcon } from "@/components/ui/ConfiguredIcon";

// Configuración de navegación (igual que en Navbar)
const navigation = [
  {
    name: "Home",
    href: "/",
    icon: "home", // Usamos 'home' para la página principal
  },
  {
    name: "Editor",
    href: "/editor",
    icon: "edit", // Usamos 'edit' para el editor
  },
  {
    name: "Mis CVs",
    href: "/saved-cvs",
    icon: "book-user", // Usamos 'archive' para mis CVs
  },
  {
    name: "Vista Previa",
    href: "/preview",
    icon: "eye", // Usamos 'eye' para vista previa
  },
  {
    name: "Guía CV",
    href: "/guia-cv",
    icon: "documentation", // Usamos 'documentation' para la guía
  },
] as const;

// Configuración de redes sociales
const socialLinks = [
  {
    name: "Portfolio",
    href: "https://imamultidev.dev",
    icon: "globe", // Usamos 'user' como portfolio personal
  },
  {
    name: "GitHub",
    href: "https://github.com/imamultidev",
    icon: "github", // Usamos 'code' como icono representativo de GitHub
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/imanol-mugueta-unsain",
    icon: "linkedin", // Usamos 'analytics' como icono representativo de LinkedIn
  },
] as const;

// Configuración de enlaces legales
const legalLinks = [
  {
    name: "Política de Privacidad",
    href: "/legal/privacy-policy",
    icon: "shield", // Usamos 'shield' para privacidad
  },
  {
    name: "Términos de Uso",
    href: "/legal/terms-of-service",
    icon: "documentation", // Usamos 'file-text' para términos
  },
  {
    name: "Licencia",
    href: "/legal/license",
    icon: "contract", // Usamos 'archive' para licencia
  },
  {
    name: "Cookies",
    href: "/legal/cookies",
    icon: "cookie", // Usamos 'cookie' para cookies
  },
] as const;

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const pathname = usePathname();

  // Función para obtener el logo correcto según el tema
  const getLogoSrc = (size: string = "64x64") => {
    return theme === "dark" ? `/logo_dark_${size}.png` : `/logo_${size}.png`;
  };

  // Función para obtener clases de enlace activo
  const getActiveLinkClasses = (href: string) => {
    const isActive = pathname === href;
    return isActive
      ? "text-blue-600 dark:text-blue-400 font-semibold"
      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white";
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 border-t border-gray-200 dark:border-gray-700">
      {/* Animated background pattern */}

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Sección Izquierda - Logo y Descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                <Image
                  src={getLogoSrc("64x64")}
                  alt="CVitaPilot Logo"
                  width={48}
                  height={48}
                  className="rounded-2xl transition-all duration-500"
                  priority
                  key={`footer-logo-${theme}`}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  CVitaPilot
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Crea tu CV perfecto
                </p>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <ConfiguredIcon
                    name={social.icon}
                    size={20}
                    className="transition-colors duration-300"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Sección Centro - Navegación */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Navegación
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-800/50 ${getActiveLinkClasses(item.href)}`}
                >
                  <ConfiguredIcon
                    name={item.icon}
                    size={16}
                    className="transition-colors duration-300"
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sección Derecha - Enlaces Legales */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Legal
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                >
                  <ConfiguredIcon
                    name={link.icon}
                    size={16}
                    className="transition-colors duration-300"
                  />
                  <span className="text-sm font-medium">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 CVitaPilot. Desarrollado por{" "}
              <a
                href="https://imamultidev.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Imanol Mugueta Unsain
              </a>
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Versión 2.2.0</span>
              <span>•</span>
              <span>Next.js 15</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
