# Damaso de Todo Store — prototipo inicial

Tienda web responsive de estilo moderno, negro y dorado.

## Archivos
- `index.html`: tienda pública y carrito.
- `app.js`: catálogo de ejemplo, carrito y flujo de pedido por WhatsApp.
- `admin.html`: panel de administración de demostración.
- `README.md`: estas instrucciones.

## Importante
Esta entrega es un prototipo estático. El panel guarda cambios en `localStorage` del navegador actual; no sincroniza productos entre dispositivos y no proporciona autenticación segura. No es todavía un sistema de administración de producción.

## Configuración rápida
1. En `app.js`, cambia `STORE_WHATSAPP` por tu número de WhatsApp con código de país, sin `+` ni espacios. Ejemplo de formato: `1809XXXXXXX`.
2. Abre `index.html` para ver la tienda.
3. Abre `admin.html` para probar crear, editar y eliminar productos.
4. El navegador debe permitir que ambos archivos compartan el almacenamiento local. Para una prueba más consistente, sírvelos desde el mismo origen local.

## Publicación gratuita (estructura preparada)
Puedes subir estos archivos a un repositorio GitHub y desplegarlo en Vercel como proyecto estático. El enlace público se crea al desplegar.
Para que el panel sea seguro y los cambios sean visibles a todos los visitantes, falta conectar Supabase (Auth, Database, Storage y políticas RLS). No coloques contraseñas ni claves secretas en el código del navegador.

## Integraciones
- WhatsApp: flujo de pedido con enlace `wa.me` (reemplaza el número).
- Facebook / Instagram: botones y catálogo comercial se pueden configurar al contar con las cuentas comerciales y el catálogo Meta correspondiente.
