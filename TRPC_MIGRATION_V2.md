# tRPC Migration V2 - Customer Endpoint

Tento dokument popisuje migraci customer endpointu na tRPC Verze 2.

## Instalace závislostí

Před spuštěním aplikace je třeba nainstalovat tRPC závislosti:

```bash
npm install @trpc/server@next @trpc/client@next @trpc/react-query@next @tanstack/react-query@latest zod superjson
```

## Co bylo implementováno

### 1. **CustomerRepositoryV2** - `src/lib/repositories/CustomerRepositoryV2.ts`
- ✅ Nový repository bez BaseRepository 
- ✅ Specifické metody místo generických
- ✅ Dokumentace s JSDoc
- ✅ Verze 2 komentáře

### 2. **CustomerServiceV2** - `src/lib/services/customer/serviceV2.ts`
- ✅ Zjednodušený service layer pro tRPC
- ✅ Type-safe metody
- ✅ Error handling
- ✅ Dokumentace s JSDoc

### 3. **tRPC Infrastructure**
- ✅ `src/server/trpc.ts` - Základní tRPC setup
- ✅ `src/server/routers/customer.ts` - Customer router s procedurami
- ✅ `src/server/root.ts` - Hlavní app router
- ✅ `src/app/api/trpc/[trpc]/route.ts` - API route handler

### 4. **Frontend Integration**
- ✅ `src/lib/trpc/client.ts` - tRPC React client
- ✅ `src/lib/trpc/Provider.tsx` - Provider komponenta
- ✅ Aktualizace `src/app/layout.tsx` - Integrace provideru
- ✅ Migrace `src/app/(routes)/customers/page.tsx` - Použití tRPC hooku

## Architektura Verze 2

### Před (V1):
```
Frontend: useCustomers hook → fetch(/api/customers) → API Route → CustomerAPI → CustomerService → BaseRepository
```

### Po (V2):
```
Frontend: trpc.customer.getAll.useQuery() → tRPC procedure → CustomerServiceV2 → CustomerRepositoryV2
```

## Výhody V2

1. **End-to-End Type Safety** - Automatické typování bez manuálních definic
2. **Zjednodušená architektura** - Méně vrstev, jasnější oddělení
3. **Lepší DX** - Autocomplete, validace, error handling
4. **Performance** - Batching, caching, optimistic updates
5. **Maintainability** - Specifické repository metody místo generických

## Použití

### Frontend (React komponenty):
```typescript
// Načtení zákazníků
const { data: customers, isLoading } = trpc.customer.getAll.useQuery({ 
  active: true 
})

// Aktualizace statusu
const updateStatus = trpc.customer.updateStatus.useMutation({
  onSuccess: () => {
    trpc.customer.getAll.invalidate()
  }
})
```

### Backend (tRPC procedury):
Vše je již nastaveno v `src/server/routers/customer.ts`

## Testování

1. Spustit aplikaci: `npm run dev`
2. Otevřít `/customers` stránku
3. Přepínat mezi aktivními/neaktivními zákazníky
4. Zkontrolovat network tab - měly by se volat `/api/trpc/customer.getAll`

## Další kroky

1. Migrovat další endpointy (transactions, salesManagers, atd.)
2. Přidat authentication middleware
3. Implementovat optimistic updates pro lepší UX
4. Přidat React Query DevTools pro debugging

## Poznámky Verze 2

- Všechny nové funkce jsou označeny komentářem "Verze 2"
- Repository má specifické metody místo generických includes
- Service layer je zjednodušený pro tRPC použití
- Frontend používá type-safe tRPC hooks 