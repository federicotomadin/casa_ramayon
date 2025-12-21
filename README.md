# Plataforma de Gestión Cultural

Una aplicación React SPA moderna para gestión cultural, incluyendo venta de entradas para eventos, reservas de mesas y comercio electrónico de materiales de arte.

## 🚀 Características

- **Eventos Culturales**: Navega y compra entradas para exposiciones, conciertos y talleres
- **Sistema de Reservas**: Reserva mesas y espacios para eventos culturales
- **Tienda de Arte**: Compra materiales de arte premium como pinturas, pinceles y lienzos
- **Diseño Responsive**: Experiencia optimizada en todos los dispositivos
- **TypeScript**: Código con tipo seguro para mejor mantenibilidad
- **Tailwind CSS v4**: Sistema de diseño moderno con tokens de diseño semánticos

## 🛠️ Stack Tecnológico

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS v4** - Estilos utilitarios
- **Radix UI** - Componentes UI accesibles
- **Lucide React** - Iconos modernos

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── layout/          # Header, Footer
│   ├── sections/        # Hero, Events, Booking, Shop
│   └── ui/             # Componentes reutilizables (shadcn/ui)
├── lib/                # Funciones utilitarias
├── hooks/              # Hooks personalizados de React
├── App.tsx             # Componente raíz
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales y tokens de diseño
```

## 🎨 Sistema de Diseño

La aplicación utiliza un sistema de diseño sofisticado con:
- **Tipografía**: Cormorant Garamond (serif) para títulos, Inter (sans-serif) para texto
- **Paleta de Colores**: Tonos cálidos inspirados en galerías de arte y espacios culturales
- **Tokens de Diseño**: Colores semánticos para consistencia en toda la aplicación

## 🚀 Inicio

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ejecutar servidor de desarrollo**
   ```bash
   npm run dev
   ```

3. **Construir para producción**
   ```bash
   npm run build
   ```

4. **Vista previa de construcción de producción**
   ```bash
   npm run preview
   ```

## 📝 Convenciones de Código

- Componentes utilizan PascalCase
- Archivos de componentes utilizan extensión `.tsx`
- Archivos utilitarios utilizan kebab-case
- Organización clara de carpetas por tipo de componente
- TypeScript estricto habilitado para seguridad de tipos

## 🌐 Navegación

La aplicación utiliza desplazamiento suave entre secciones con enlaces anclados:
- `/` - Página de inicio con todas las secciones
- `#events` - Sección de eventos
- `#bookings` - Sección de reservas
- `#shop` - Sección de tienda

## 📄 Licencia

Privado - Todos los derechos reservados
