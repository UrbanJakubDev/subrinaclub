# Subrina Club Application Architecture

## Current Architecture Overview

The application currently follows a layered architecture with the following components:

1. **UI Layer** - Next.js pages and React components
2. **API Layer** - Next.js API routes (`src/app/api/*`)
3. **Service Layer** - Business logic (`src/lib/services/*`)
4. **Repository Layer** - Data access (`src/lib/repositories/*`)
5. **Database Layer** - Prisma ORM with PostgreSQL

### Current Data Flow

Currently, the application uses two approaches for data fetching:

1. **Server-side rendering** - Pages fetch data directly from repositories or services during server rendering
2. **API calls** - Some components fetch data via API routes

## Recommended Architecture

To simplify the codebase and make it more maintainable, we recommend standardizing on a client-side data fetching approach using the API layer. This will:

1. Create a clear separation between frontend and backend
2. Make the codebase more maintainable
3. Enable better error handling and loading states
4. Support future migration to a fully separated frontend/backend if needed

### Recommended Data Flow

```
UI Components → API Clients → API Routes → Services → Repositories → Database
```

## Implementation Guidelines

### 1. API Client Layer

Create API client functions for each entity in your application:

```typescript
// src/lib/api-client/customer.ts
import { CustomerResponseDTO } from "@/types/customer";

export const customerClient = {
  getCustomer: async (id: number): Promise<CustomerResponseDTO> => {
    const response = await fetch(`/api/customers/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch customer');
    }
    return response.json();
  },
  
  getAllCustomers: async (active?: boolean): Promise<CustomerResponseDTO[]> => {
    const url = active !== undefined 
      ? `/api/customers?active=${active}` 
      : '/api/customers';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    return response.json();
  },
  
  // Add other methods as needed
};
```

### 2. React Hooks for Data Fetching

Use React hooks (with libraries like SWR or React Query) to handle data fetching, caching, and state management:

```typescript
// src/lib/hooks/useCustomer.ts
import useSWR from 'swr';
import { customerClient } from '@/lib/api-client/customer';

export function useCustomer(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/customers/${id}` : null,
    () => customerClient.getCustomer(id)
  );

  return {
    customer: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useCustomers(active?: boolean) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/customers${active !== undefined ? `?active=${active}` : ''}`,
    () => customerClient.getAllCustomers(active)
  );

  return {
    customers: data,
    isLoading,
    isError: error,
    mutate
  };
}
```

### 3. Component Usage

Update components to use these hooks:

```tsx
// Example component
import { useCustomer } from '@/lib/hooks/useCustomer';

function CustomerDetails({ customerId }: { customerId: number }) {
  const { customer, isLoading, isError } = useCustomer(customerId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading customer</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div>
      <h1>{customer.fullName}</h1>
      {/* Other customer details */}
    </div>
  );
}
```

## Practical Example: Implementing Transactions API Client

Let's walk through a complete example of implementing the API client and hooks for transactions:

### Step 1: Create the Transaction API Client

```typescript
// src/lib/api-client/transaction.ts
import { Transaction } from "@/types/transaction";

export const transactionClient = {
  // Get transactions for a specific account
  getTransactionsByAccountId: async (accountId: number): Promise<Transaction[]> => {
    const response = await fetch(`/api/transactions?accountId=${accountId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    return response.json();
  },
  
  // Create a new transaction
  createTransaction: async (transactionData: any): Promise<Transaction> => {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create transaction');
    }
    
    return response.json();
  },
  
  // Update an existing transaction
  updateTransaction: async (id: number, transactionData: any): Promise<Transaction> => {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update transaction');
    }
    
    return response.json();
  },
  
  // Delete a transaction
  deleteTransaction: async (id: number): Promise<void> => {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete transaction');
    }
  }
};
```

### Step 2: Create Transaction Hooks

```typescript
// src/lib/hooks/useTransaction.ts
import useSWR, { mutate as globalMutate } from 'swr';
import { transactionClient } from '@/lib/api-client/transaction';
import { useState } from 'react';

// Hook for fetching transactions for an account
export function useAccountTransactions(accountId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    accountId ? `/api/transactions?accountId=${accountId}` : null,
    () => transactionClient.getTransactionsByAccountId(accountId)
  );

  return {
    transactions: data,
    isLoading,
    isError: error,
    mutate
  };
}

// Hook for transaction operations (create, update, delete)
export function useTransactionOperations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create a new transaction
  const createTransaction = async (transactionData: any, accountId: number) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await transactionClient.createTransaction(transactionData);
      
      // Invalidate the transactions cache for this account
      await globalMutate(`/api/transactions?accountId=${accountId}`);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update an existing transaction
  const updateTransaction = async (id: number, transactionData: any, accountId: number) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await transactionClient.updateTransaction(id, transactionData);
      
      // Invalidate the transactions cache for this account
      await globalMutate(`/api/transactions?accountId=${accountId}`);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id: number, accountId: number) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await transactionClient.deleteTransaction(id);
      
      // Invalidate the transactions cache for this account
      await globalMutate(`/api/transactions?accountId=${accountId}`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isSubmitting,
    error
  };
}
```

### Step 3: Use the Hooks in a Component

```tsx
// src/components/features/transactions/TransactionList.tsx
'use client';

import { useAccountTransactions, useTransactionOperations } from '@/lib/hooks/useTransaction';
import { useState } from 'react';

interface TransactionListProps {
  accountId: number;
}

export default function TransactionList({ accountId }: TransactionListProps) {
  const { transactions, isLoading, isError, mutate } = useAccountTransactions(accountId);
  const { deleteTransaction, isSubmitting } = useTransactionOperations();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (transactionId: number) => {
    try {
      await deleteTransaction(transactionId, accountId);
      setDeleteError(null);
    } catch (error) {
      setDeleteError('Failed to delete transaction');
    }
  };

  if (isLoading) return <div>Loading transactions...</div>;
  if (isError) return <div>Error loading transactions</div>;
  if (!transactions || transactions.length === 0) return <div>No transactions found</div>;

  return (
    <div>
      {deleteError && <div className="error">{deleteError}</div>}
      
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Year</th>
            <th>Quarter</th>
            <th>Points</th>
            <th>Type</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.year}</td>
              <td>{transaction.quarter}</td>
              <td>{transaction.points}</td>
              <td>{transaction.type}</td>
              <td>{transaction.description}</td>
              <td>
                <button 
                  onClick={() => handleDelete(transaction.id)}
                  disabled={isSubmitting}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Refactoring Cookbook

### Step 1: Create API Clients

1. Identify all entities in your application (Customer, Transaction, Account, etc.)
2. Create API client files for each entity in `src/lib/api-client/`
3. Implement methods for all CRUD operations and specialized queries

### Step 2: Create React Hooks

1. Create hook files for each entity in `src/lib/hooks/`
2. Implement hooks for common data fetching patterns
3. Add proper error handling and loading states

### Step 3: Update Components

1. Identify components that currently use server-rendered data
2. Replace direct data access with hooks
3. Add loading and error states to improve user experience

### Step 4: Update Pages

1. Convert server-rendered pages to client components where appropriate
2. Use the new hooks for data fetching
3. Implement proper loading states and error boundaries

## Best Practices

1. **Consistent API Responses** - Ensure all API routes return data in a consistent format
2. **Error Handling** - Implement proper error handling at all levels
3. **Type Safety** - Use TypeScript interfaces for all API responses and requests
4. **Caching Strategy** - Configure SWR or React Query with appropriate caching strategies
5. **Optimistic Updates** - Implement optimistic updates for better user experience

## Example: Refactoring a Page

### Before (Server-rendered):

```tsx
// src/app/(routes)/customers/[id]/page.tsx
export default async function CustomerDetail({ params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);
  const customer = await customerService.get(customerId);
  
  return (
    <div>
      <h1>{customer.fullName}</h1>
      {/* Other customer details */}
    </div>
  );
}
```

### After (Client-side data fetching):

```tsx
'use client';

// src/app/(routes)/customers/[id]/page.tsx
import { useCustomer } from '@/lib/hooks/useCustomer';

export default function CustomerDetail({ params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);
  const { customer, isLoading, isError } = useCustomer(customerId);
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading customer</div>;
  if (!customer) return <div>Customer not found</div>;
  
  return (
    <div>
      <h1>{customer.fullName}</h1>
      {/* Other customer details */}
    </div>
  );
}
```

## Conclusion

By standardizing on client-side data fetching through the API layer, you'll create a more maintainable and scalable application architecture. This approach provides a clear separation of concerns, better error handling, and improved user experience through proper loading states.

The transition can be done incrementally, starting with the most complex or problematic areas of your application. As you refactor each component, you'll see immediate benefits in code clarity and maintainability. 