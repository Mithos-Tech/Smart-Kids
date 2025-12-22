# Configuración de Seguridad

## Firebase Authentication
- Usuario admin: director@smartkids.edu
- Método: Email/Password
- Implementado: 21 dic 2025

## Firestore Rules
- Lectura pública: Episodios, Team, Gallery
- Escritura: Solo usuarios autenticados
- Suscriptores: Escritura pública (formulario), lectura autenticada
- Actualizado: 21 dic 2025

## Variables de Entorno
- Protegidas en `.env.local`
- Incluidas en `.gitignore`
- TODO: Configurar en Vercel

## Próximos Pasos
1. Agregar variables de entorno en Vercel
2. Considerar dominio personalizado
3. Monitorear uso de Firestore
