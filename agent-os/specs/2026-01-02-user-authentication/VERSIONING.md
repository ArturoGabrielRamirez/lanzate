# Estrategia de Versionado - Sistema de Autenticación

## Filosofía de Versionado

Este proyecto utiliza **Semantic Versioning 2.0.0** adaptado para el desarrollo incremental basado en task groups.

### Formato: `MAJOR.MINOR.PATCH`

- **MAJOR** (0): Indica que el proyecto está en desarrollo inicial (pre-1.0.0)
- **MINOR**: Incrementa con cada Task Group completado
- **PATCH**: Incrementa para hotfixes o correcciones menores

---

## Historial de Versiones

### v0.7.0 - ACTUAL ✨
**Fecha**: 2026-01-05
**Estado**: Task Group 6 completado
**Features**:
- ✅ Task Group 1: Core Infrastructure and Global Components
- ✅ Task Group 2: Validation Schemas and Types
- ✅ Task Group 3: Data Layer and Business Logic
- ✅ Task Group 4: Server Actions for Authentication
- ✅ Task Group 5: Authentication UI Components
- ✅ Task Group 6: Authentication Pages and Routes

**Commits clave**:
- `be10a3a0` - feat: finish tasks group 6
- `37225ec0` - feat: finish tasks group 5.0
- `c4b2097d` - feat: complete server actions and ensure tests pass
- `582a0635` - feat: implement user authentication data layer
- `8b2bf82e` - feat: implement authentication validation schemas
- `283d035e` - feat: implement global form components
- `e55417ed` - feat: add actionWrapper utility tests

**Entregables**:
- Páginas de autenticación completas (signup, login, reset password, profile)
- Componentes UI reutilizables (forms, inputs, auth card)
- Server actions para todas las operaciones de autenticación
- Capa de datos y servicios con Prisma y Supabase
- Validación completa con Yup schemas
- Infraestructura global (actionWrapper, ServerResponse, Form components)

---

### v0.6.0
**Fecha estimada**: Completado en desarrollo
**Features**: Task Group 5 - Authentication UI Components completado
- SignupForm, LoginForm, GoogleAuthButton
- PasswordResetRequestForm, PasswordResetForm
- ProfileEditForm, AuthCard wrapper
- Tests de componentes UI

---

### v0.5.0
**Fecha estimada**: Completado en desarrollo
**Features**: Task Group 4 - Server Actions completado
- handleSignup, handleLogin, handleLogout
- handleGoogleLogin, OAuth callback handler
- handleResetPasswordRequest, handleResetPassword
- getCurrentUser, updateProfile actions

---

### v0.4.0
**Fecha estimada**: Completado en desarrollo
**Features**: Task Group 3 - Data Layer and Services completado
- Data layer functions (createUser, findUserByEmail, etc.)
- Service layer (createUser.service, validateCredentials, etc.)
- Utilities (generateUsername, getAuthUser, getAuthSession)

---

### v0.3.0
**Fecha estimada**: Completado en desarrollo
**Features**: Task Group 2 - Validation and Types completado
- Authentication schemas (signup, login, reset password)
- Field validators (email, password)
- Auth types and constants
- Message constants (i18n structure)

---

### v0.2.0
**Fecha estimada**: Completado en desarrollo
**Features**: Task Group 1 - Core Infrastructure completado
- Global Form wrapper component
- Global InputField component
- actionWrapper utility
- ServerResponse type
- Core tests (2-8 focused tests)

---

### v0.1.0 - Baseline
**Fecha**: Inicio del proyecto
**Estado**: Configuración inicial del proyecto
**Features**:
- Next.js 16.1.1 setup
- Supabase integration
- Prisma ORM setup
- shadcn/ui components
- Basic project structure

---

## Roadmap de Versiones Futuras

### v0.8.0 - PRÓXIMA VERSIÓN 🎯
**Task Group 7**: Proxy and Session Management
**Features planeadas**:
- [ ] Next.js 16+ proxy implementation (`proxy.ts`)
- [ ] Supabase proxy helper (lightweight session checks)
- [ ] Route guards utilities
- [ ] Protected routes middleware
- [ ] Session validation and redirects
- [ ] 2-8 focused tests for proxy

**Criterio de aceptación**:
- Proxy implementado según Next.js 16+ conventions
- Redirects funcionando (unauthenticated → /login, authenticated → /dashboard)
- Tests de proxy pasando

---

### v0.9.0 - CANDIDATO A RC
**Task Group 8**: i18n Integration and Comprehensive Testing
**Features planeadas**:
- [ ] Archivos de traducción (ES/EN) para auth
- [ ] Integración de next-intl en componentes
- [ ] Schemas de validación con mensajes traducidos
- [ ] Hasta 10 tests adicionales estratégicos
- [ ] Tests end-to-end de flujos completos
- [ ] Testing de OAuth flow completo
- [ ] Testing de password reset flow

**Criterio de aceptación**:
- Todos los tests pasando (≈24-66 tests)
- Traducciones completas en ES/EN
- Flujos end-to-end verificados

---

### v1.0.0 - PRIMERA VERSIÓN ESTABLE 🚀
**Fecha estimada**: Después de completar Task Groups 1-8
**Requisitos**:
- ✅ Todos los Task Groups (1-8) completados
- ✅ Todos los tests pasando
- ✅ Sistema de autenticación completo y funcional
- ✅ Documentación completa
- ✅ Sin bugs críticos conocidos
- ✅ Code review y QA completados

**Features completas**:
1. Sistema de autenticación email/password + Google OAuth
2. Protección de rutas con Next.js 16+ proxy
3. Recuperación de contraseña
4. Edición de perfil básico
5. Componentes globales reutilizables (Form, InputField)
6. i18n completo (ES/EN)
7. Test coverage completo
8. Manejo de errores consistente
9. Diseño responsive
10. Type-safety completo

---

## Convenciones de Versionado

### Cuándo incrementar versiones:

#### MINOR (0.X.0)
- ✅ Al completar un Task Group completo
- ✅ Al agregar una feature significativa nueva
- ✅ Al completar un milestone del proyecto

#### PATCH (0.7.X)
- 🔧 Hotfixes para bugs críticos
- 🔧 Correcciones menores sin agregar funcionalidad
- 🔧 Mejoras de performance sin cambios en API
- 🔧 Actualizaciones de documentación
- 🔧 Refactoring interno sin cambios de comportamiento

#### MAJOR (X.0.0)
- 🚀 Primera versión estable (0.9.0 → 1.0.0)
- 🚀 Breaking changes en API pública
- 🚀 Refactorings masivos que cambian la arquitectura

---

## Proceso de Actualización de Versión

### Al completar un Task Group:

1. **Verificar completion**:
   ```bash
   # Verificar que todos los tests del task group pasen
   bun test features/auth  # o el path correspondiente
   ```

2. **Actualizar package.json**:
   ```bash
   # Ejemplo: de 0.7.0 a 0.8.0 al completar Task Group 7
   # Editar manualmente o usar:
   npm version minor  # incrementa MINOR
   ```

3. **Actualizar VERSIONING.md**:
   - Agregar la nueva versión al historial
   - Actualizar "ACTUAL" a la nueva versión
   - Incluir commits clave y entregables

4. **Crear commit de versión**:
   ```bash
   git add package.json agent-os/specs/2026-01-02-user-authentication/VERSIONING.md
   git commit -m "chore: bump version to 0.8.0 - complete Task Group 7"
   ```

5. **Crear tag de versión** (opcional):
   ```bash
   git tag -a v0.8.0 -m "Task Group 7: Proxy and Session Management completed"
   git push origin v0.8.0
   ```

---

## Releases y Tags

### Estrategia de Tags:

- **v0.X.0**: Tags para cada Task Group completado
- **v1.0.0**: Tag para primera versión estable
- **v1.0.X**: Tags para hotfixes post-release

### Ejemplo de flujo:

```bash
# Completar Task Group 7
bun test features/auth/utils/proxy
# ✅ Tests passing

# Actualizar versión
npm version minor  # 0.7.0 → 0.8.0

# Commit y tag
git commit -m "chore: bump version to 0.8.0 - complete Task Group 7"
git tag -a v0.8.0 -m "Proxy and Session Management completed"
git push origin feature/agent-os-setup --tags
```

---

## Changelog Format

Para cada versión, documentar:

```markdown
### vX.Y.Z
**Fecha**: YYYY-MM-DD
**Task Group**: N - Nombre del Task Group
**Features**:
- Feature 1
- Feature 2

**Commits clave**:
- hash - descripción

**Entregables**:
- Deliverable 1
- Deliverable 2

**Breaking Changes** (si aplica):
- Change 1
```

---

## Verificación Pre-Release

Antes de incrementar a una nueva versión MINOR, verificar:

- [ ] Todos los tests del Task Group pasan
- [ ] No hay console.errors en desarrollo
- [ ] Code review completado (si aplica)
- [ ] Documentación actualizada
- [ ] No hay TODOs críticos pendientes
- [ ] Build de producción exitoso (`bun run build`)

---

## Versionado de Features Individuales

Para features fuera de los Task Groups principales, usar PATCH:

```
0.7.1 - Fix: Corrección en validación de email
0.7.2 - Fix: Mejorar manejo de errores en signup
0.7.3 - Docs: Actualizar README con instrucciones de setup
```

---

## Migración a v1.0.0

### Checklist para Release 1.0.0:

- [ ] Task Groups 1-8 completados al 100%
- [ ] Todos los tests pasando (≈24-66 tests)
- [ ] Code coverage > 80% para features críticas
- [ ] Performance audit completado
- [ ] Security audit completado
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS, Android)
- [ ] Documentation completa:
  - [ ] README
  - [ ] API documentation
  - [ ] User guides
  - [ ] Developer setup guide
- [ ] Changelog completo
- [ ] Migration guide (si aplica)
- [ ] Production deployment exitoso
- [ ] Monitoring y logging configurados

---

## Notas Importantes

1. **Pre-1.0.0**: El proyecto está en desarrollo activo. Cambios breaking pueden ocurrir entre versiones MINOR.

2. **Semantic Versioning estricto después de 1.0.0**: Una vez en v1.0.0, seguir SemVer estrictamente.

3. **Documentación**: Cada versión MINOR debe actualizar este documento.

4. **Testing**: No se debe incrementar versión sin que los tests pasen.

5. **Git Tags**: Usar tags para versiones MINOR, opcional para PATCH.

---

## Referencias

- [Semantic Versioning 2.0.0](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
