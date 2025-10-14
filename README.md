# LANZATE APP

This is the main repository for the LANZATE app. A customizable app for your home business.

## Stack

- Next.js
- Tailwind CSS
- TypeScript
- Supabase
- Prisma
- Next-Intl & Next-International
- React Hook Form
- ShadCN UI
- Yup
- Resend
- Featured directory architecture
- Lucide Icons


## Supabase Access Grant

These are the grants that are needed to be able to use the database back again after a prisma reset

```sql
grant usage on schema "public" to anon;
grant usage on schema "public" to authenticated;

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA "public" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA "public" TO anon;
```

## Implementations

* #### React Components
    - Implement each component in a separate file
    - Use the component name as the file name but lowercase and hyphenated
    - Use the component name as the export name
    - Add the new file to the index.ts file for barrel export consistency
    - Use Server Component first approach. If it needs browser interaction then it should be decoupled in a Client Component only the parts that need it.

```tsx
//Example 1
// my-server-component.tsx
function MyComponent() {
    return <div>My Component</div>
}

export { MyComponent }
```

```tsx
//Example 2
// my-server-component.tsx
function MyComponent() {
    return <MyClientComponent />
}

export { MyComponent }

// my-client-component.tsx
"use client"

function MyClientComponent() {
    return <div>My Client Component</div>
}
export { MyClientComponent }

//
```

* #### Fetching Data
* #### Forms
* #### Server Actions
* #### Events