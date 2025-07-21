# Guía de Interacciones de Base de Datos - Aplicación E-commerce

## 1. GESTIÓN DE USUARIOS - DONE

### 1.1 Registro de Usuario
**Pasos:**
1. Check if email already exists
2. Hash password
3. Create user record
4. Create default account (FREE)
5. Send welcome notification
6. Crear registro en action_logs ("register_user")

**Tablas involucradas:**
- `users` (CREATE)
- `accounts` (CREATE)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Email duplicado → Rollback completo
- Error en hash → No crear usuario
- Error en account → Rollback user creation

---

### 1.2 Login de Usuario - DONE
**Pasos:**
1. Find user by email
2. Verify password hash
3. Update last_login timestamp
4. Generate session/token
5. Crear registro en action_logs ("login_user")

**Tablas involucradas:**
- `users` (READ, UPDATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Usuario no encontrado → Error 404
- Password incorrecto → Error 401
- Usuario inactivo → Error 403

---

### 1.3 Actualizar Perfil de Usuario
**Pasos:**
1. Check user exists and is authenticated
2. Update user fields
3. Update avatar if provided
4. Log profile change
5. Crear registro en action_logs ("update_profile")

**Tablas involucradas:**
- `users` (READ, UPDATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Usuario no encontrado → Error 404
- Datos inválidos → Error 400

---

## 2. GESTIÓN DE TIENDAS

### 2.1 Crear Nueva Tienda
**Pasos:**
1. Check user is authenticated
2. Check user account type allows store creation
3. Verify slug and subdomain availability
4. Create store record
5. Create default branch
6. Create success notification
7. Crear registro en action_logs ("create_store")

**Tablas involucradas:**
- `stores` (CREATE)
- `branches` (CREATE)
- `accounts` (READ)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Slug/subdomain duplicado → Error 409
- Límite de tiendas alcanzado → Error 403
- Error en branch creation → Rollback store

---

### 2.2 Actualizar Tienda
**Pasos:**
1. Check user owns store
2. Check slug/subdomain availability if changed
3. Update store fields
4. Update logo if provided
5. Log store modification
6. Crear registro en action_logs ("update_store")

**Tablas involucradas:**
- `stores` (READ, UPDATE)
- `users` (READ)
- `action_logs` (CREATE)

**Manejo de errores:**
- Usuario no es owner → Error 403
- Slug duplicado → Error 409

---

### 2.3 Eliminar Tienda
**Pasos:**
1. Check user owns store
2. Check for pending orders
3. Archive all products
4. Cancel pending orders
5. Delete store cascade
6. Create deletion notification
7. Crear registro en action_logs ("delete_store")

**Tablas involucradas:**
- `stores` (DELETE)
- `products` (UPDATE - archive)
- `orders` (READ, UPDATE)
- `branches` (DELETE - cascade)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Órdenes pendientes → Error 409
- Error en cascade → Rollback completo

---

## 3. GESTIÓN DE PRODUCTOS

### 3.1 Crear Producto
**Pasos:**
1. Check user owns store
2. Verify SKU uniqueness
3. Generate slug from name
4. Create product record
5. Create initial stock entry for each branch
6. Create product notification
7. Crear registro en action_logs ("create_product")

**Tablas involucradas:**
- `products` (CREATE)
- `stores` (READ)
- `branches` (READ)
- `product_stocks` (CREATE)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- SKU duplicado → Error 409
- Slug duplicado → Auto-generate variant
- Error en stock creation → Rollback product

---

### 3.2 Actualizar Producto
**Pasos:**
1. Check user owns product
2. Check SKU uniqueness if changed
3. Update product fields
4. Update image/video if provided
5. Log product modification
6. Crear registro en action_logs ("update_product")

**Tablas involucradas:**
- `products` (READ, UPDATE)
- `users` (READ)
- `action_logs` (CREATE)

**Manejo de errores:**
- Usuario no es owner → Error 403
- SKU duplicado → Error 409

---

### 3.3 Gestionar Stock por Sucursal
**Pasos:**
1. Check user owns store/branch
2. Find or create product_stock record
3. Update quantity
4. Log stock movement
5. Check low stock alerts
6. Crear registro en action_logs ("update_stock")

**Tablas involucradas:**
- `product_stocks` (READ, UPDATE, CREATE)
- `products` (READ)
- `branches` (READ)
- `notifications` (CREATE si stock bajo)
- `action_logs` (CREATE)

**Manejo de errores:**
- Stock negativo → Error 400
- Producto no encontrado → Error 404

---

### 3.4 Publicar/Despublicar Producto
**Pasos:**
1. Check user owns product
2. Check product has stock if publishing
3. Update is_published status
4. Update is_active if needed
5. Log status change
6. Crear registro en action_logs ("publish_unpublish_product")

**Tablas involucradas:**
- `products` (READ, UPDATE)
- `product_stocks` (READ)
- `action_logs` (CREATE)

**Manejo de errores:**
- Sin stock para publicar → Error 400
- Producto no encontrado → Error 404

---

## 4. GESTIÓN DE CATEGORÍAS

### 4.1 Crear Categoría
**Pasos:**
1. Check admin permissions
2. Verify slug uniqueness
3. Create category record
4. Upload image if provided
5. Crear registro en action_logs ("create_category")

**Tablas involucradas:**
- `categories` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Slug duplicado → Error 409
- Permisos insuficientes → Error 403

---

### 4.2 Asignar Productos a Categoría
**Pasos:**
1. Check user owns products
2. Check category exists
3. Update product-category relations
4. Log assignment
5. Crear registro en action_logs ("assign_product_category")

**Tablas involucradas:**
- `products` (READ, UPDATE - many-to-many)
- `categories` (READ)
- `action_logs` (CREATE)

**Manejo de errores:**
- Categoría no existe → Error 404
- Usuario no owner → Error 403

---

## 5. GESTIÓN DE ÓRDENES

### 5.1 Nueva Orden de Compra
**Pasos:**
1. Check user is authenticated - pending
2. Check store exists and is active - pending
3. Check branch exists - pending
4. Validate each product exists and is active - pending
5. Check product stock availability in branch - pending
6. Calculate total price and quantity - pending
7. Create order record - pending
8. Create order items - pending
9. Reduce stock for each product in branch - pending
10. Create payment record (PENDING) - pending
11. Actualizar balance de usuario y tienda (si aplica)
12. Crear transacción asociada a la orden
13. Send order confirmation notification - pending
14. Crear registro en action_logs ("create_order")

**Tablas involucradas:**
- `orders` (CREATE)
- `order_items` (CREATE)
- `product_stocks` (READ, UPDATE)
- `order_payments` (CREATE)
- `balances` (UPDATE)
- `transactions` (CREATE)
- `products` (READ)
- `stores` (READ)
- `branches` (READ)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Stock insuficiente → Error 409, rollback completo
- Producto inactivo → Error 400
- Error en payment → Rollback order y stock
- Error en items → Rollback order

---

### 5.2 Actualizar Estado de Orden
**Pasos:**
1. Check user owns store or is order owner
2. Check valid status transition
3. Update order status
4. Create status change notification
5. Log status change
6. Trigger additional actions per status
7. Si el cambio de estado implica movimiento de dinero, actualizar balances y crear transacción
8. Crear registro en action_logs ("update_order_status")

**Tablas involucradas:**
- `orders` (READ, UPDATE)
- `notifications` (CREATE)
- `balances` (UPDATE, si aplica)
- `transactions` (CREATE, si aplica)
- `action_logs` (CREATE)

**Manejo de errores:**
- Transición inválida → Error 400
- Permisos insuficientes → Error 403

---

### 5.3 Cancelar Orden
**Pasos:**
1. Check user owns order or store
2. Check order can be cancelled (not DELIVERED)
3. Restore stock for each product
4. Update order status to CANCELLED
5. Cancel payment if exists
6. Actualizar balances y crear transacción de reversa (si aplica)
7. Send cancellation notification
8. Crear registro en action_logs ("cancel_order")

**Tablas involucradas:**
- `orders` (READ, UPDATE)
- `order_items` (READ)
- `product_stocks` (READ, UPDATE)
- `order_payments` (READ, UPDATE)
- `balances` (UPDATE, si aplica)
- `transactions` (CREATE, si aplica)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Orden no cancelable → Error 409
- Error en stock restore → Rollback

---

### 5.4 Procesar Pago
**Pasos:**
1. Check order exists and is PENDING
2. Check payment amount matches order total
3. Process payment with gateway
4. Update payment status to PAID
5. Update order status to PROCESSING
6. Actualizar balances de usuario y tienda
7. Crear transacción de pago
8. Send payment confirmation notification
9. Crear registro en action_logs ("process_payment")

**Tablas involucradas:**
- `order_payments` (READ, UPDATE)
- `orders` (READ, UPDATE)
- `balances` (UPDATE)
- `transactions` (CREATE)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Pago ya procesado → Error 409
- Monto incorrecto → Error 400
- Error en gateway → Mantener PENDING

---

## 6. GESTIÓN DE SUCURSALES

### 6.1 Crear Sucursal
**Pasos:**
1. Check user owns store
2. Create branch record
3. Initialize stock for all store products
4. Create branch notification
5. Crear registro en action_logs ("create_branch")

**Tablas involucradas:**
- `branches` (CREATE)
- `stores` (READ)
- `products` (READ)
- `product_stocks` (CREATE)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Error en stock init → Rollback branch
- Store no encontrado → Error 404

---

### 6.2 Actualizar Sucursal
**Pasos:**
1. Check user owns store
2. Update branch fields
3. Log branch modification
4. Crear registro en action_logs ("update_branch")

**Tablas involucradas:**
- `branches` (READ, UPDATE)
- `stores` (READ)
- `action_logs` (CREATE)

**Manejo de errores:**
- Usuario no owner → Error 403
- Branch no encontrado → Error 404

---

### 6.3 Eliminar Sucursal
**Pasos:**
1. Check user owns store
2. Check no pending orders for branch
3. Transfer stock to main branch
4. Delete branch record
5. Log deletion
6. Crear registro en action_logs ("delete_branch")

**Tablas involucradas:**
- `branches` (READ, DELETE)
- `orders` (READ)
- `product_stocks` (READ, UPDATE, DELETE)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Órdenes pendientes → Error 409
- Es única sucursal → Error 409

---

## 7. GESTIÓN DE NOTIFICACIONES

### 7.1 Crear Notificación
**Pasos:**
1. Check user exists
2. Create notification record
3. Send push/email if configured
4. Crear registro en action_logs ("create_notification")

**Tablas involucradas:**
- `notifications` (CREATE)
- `users` (READ)
- `action_logs` (CREATE)

**Manejo de errores:**
- Usuario no existe → Error 404

---

### 7.2 Marcar como Leída
**Pasos:**
1. Check user owns notification
2. Update read status
3. Log read action
4. Crear registro en action_logs ("read_notification")

**Tablas involucradas:**
- `notifications` (READ, UPDATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Notificación no encontrada → Error 404
- Usuario no owner → Error 403

---

### 7.3 Limpiar Notificaciones Antiguas
**Pasos:**
1. Find notifications older than X days
2. Delete old notifications
3. Log cleanup action
4. Crear registro en action_logs ("cleanup_notifications")

**Tablas involucradas:**
- `notifications` (READ, DELETE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Error en batch delete → Log y continuar

---

## 8. GESTIÓN DE CUENTAS

### 8.1 Actualizar Tipo de Cuenta
**Pasos:**
1. Check user owns account
2. Verify upgrade/downgrade permissions
3. Update account type
4. Apply new limitations/benefits
5. Actualizar balance y crear transacción si aplica
6. Create upgrade notification
7. Crear registro en action_logs ("update_account_type")

**Tablas involucradas:**
- `accounts` (READ, UPDATE)
- `users` (READ)
- `balances` (UPDATE, si aplica)
- `transactions` (CREATE, si aplica)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Downgrade con limitaciones → Error 409
- Pago requerido → Error 402

---

## 9. REPORTES Y ANALYTICS

### 9.1 Reporte de Ventas por Tienda
**Pasos:**
1. Check user owns store
2. Query orders by date range
3. Aggregate sales data
4. Calculate totals and metrics
5. Log report generation
6. Crear registro en action_logs ("generate_sales_report")

**Tablas involucradas:**
- `orders` (READ)
- `order_items` (READ)
- `products` (READ)
- `stores` (READ)
- `action_logs` (CREATE)

**Manejo de errores:**
- Rango de fechas inválido → Error 400
- Sin permisos → Error 403

---

### 9.2 Reporte de Stock Bajo
**Pasos:**
1. Check user owns store
2. Query products with low stock
3. Group by branch
4. Generate alert recommendations
5. Create low stock notifications
6. Crear registro en action_logs ("generate_low_stock_report")

**Tablas involucradas:**
- `product_stocks` (READ)
- `products` (READ)
- `branches` (READ)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Store no encontrado → Error 404

---

## 10. OPERACIONES ADMINISTRATIVAS

### 10.1 Backup de Datos
**Pasos:**
1. Check admin permissions
2. Create database snapshot
3. Export to storage
4. Log backup operation
5. Clean old backups
6. Crear registro en action_logs ("backup_data")

**Tablas involucradas:**
- Todas las tablas (READ)
- `action_logs` (CREATE)

**Manejo de errores:**
- Error en export → Retry y log
- Storage full → Error 507

---

### 10.2 Migración de Datos
**Pasos:**
1. Check admin permissions
2. Validate migration script
3. Create backup before migration
4. Run migration
5. Verify data integrity
6. Log migration results
7. Crear registro en action_logs ("migrate_data")

**Tablas involucradas:**
- Todas las tablas (READ, UPDATE, CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Validation fail → Abort migration
- Migration error → Restore backup

---

### 10.3 Limpieza de Datos Huérfanos
**Pasos:**
1. Check admin permissions
2. Find orphaned records
3. Backup orphaned data
4. Delete orphaned records
5. Log cleanup results
6. Crear registro en action_logs ("cleanup_orphans")

**Tablas involucradas:**
- Todas las tablas (READ, DELETE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Error en delete → Log y continuar
- Backup fail → Abort cleanup

---

## NOTAS TÉCNICAS IMPORTANTES

### Transacciones Requeridas
- Creación de órdenes (pasos 7-13)
- Cancelación de órdenes (pasos 3-7)
- Eliminación de tiendas (pasos 3-6)
- Creación de sucursales (pasos 2-4)
- Actualización de balances y creación de transacciones donde aplique
- Registro en action_logs en cada operación relevante

### Índices Recomendados
- `users.email` (único)
- `stores.slug` (único)
- `stores.subdomain` (único)
- `products.sku` (único)
- `products.slug` (único)
- `orders.user_id`
- `orders.store_id`
- `orders.created_at`
- `product_stocks.product_id, branch_id` (compuesto)

### Consideraciones de Performance
- Usar `SELECT FOR UPDATE` en operaciones de stock
- Implementar cache para consultas de productos
- Paginar resultados en listados grandes
- Usar soft deletes para auditoría

### Logs de Auditoría
- Todas las operaciones CRUD y de negocio deben logearse en `action_logs`
- Incluir user_id, timestamp, tabla/entidad afectada, operación, detalles
- Considerar tabla separada para audit_logs (action_logs extendido)