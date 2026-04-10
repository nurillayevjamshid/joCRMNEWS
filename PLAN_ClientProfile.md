# Client Profile Feature Plan

## 1. Overview

This document outlines the plan to extend the existing joCRMNEWS project with a comprehensive Client Profile feature. The goal is to provide a detailed view for each client, including their card, history, notes, timeline, orders, and tags, while maintaining the current clean architecture, reusable components, and consistent UI.

## 2. Current Architecture Analysis

Based on the analysis of the existing codebase:

-   **Technology Stack**: React, TypeScript, TailwindCSS, Firebase (Firestore).
-   **Routing**: The application uses a state-based routing mechanism managed by `App.tsx`. The `activeView` state variable determines which main component is rendered. Navigation is primarily handled by the `Sidebar.tsx` component.
-   **Data Management**: `dataService.ts` provides an abstraction layer for interacting with Firebase Firestore, offering methods for saving, fetching, updating, and deleting data, as well as real-time subscriptions.
-   **Existing Components**: `Customers.tsx` lists customers, `CalendarView.tsx` and `Projects.tsx` demonstrate CRUD operations and data display patterns.

## 3. Proposed Data Model Extension

The existing `Customer` interface in `Customers.tsx` will be extended to accommodate the new profile details. Additional collections in Firestore might be created for related data like `orders`, `notes`, and `timeline_events`, linked by `customerId`.

### Existing Customer Interface (from `Customers.tsx`):

```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  spent: string;
  joined: string;
  avatar: string;
  createdAt?: any;
}
```

### Proposed Data Structures for Client Profile:

-   **Client Card**: Will primarily use and extend the existing `Customer` interface. Additional fields like `phone`, `address`, `industry`, etc., can be added directly to the customer document if needed.
-   **History**: A new Firestore collection `clientHistory` will store events related to a client. Each document will have `customerId`, `type` (e.g., 'call', 'email', 'meeting'), `date`, `description`, and `userId`.
-   **Notes**: A new Firestore collection `clientNotes` will store notes for a client. Each document will have `customerId`, `content`, `createdAt`, and `userId`.
-   **Timeline**: This will be a composite view, combining `clientHistory`, `clientNotes`, and potentially `orders` data, sorted by date.
-   **Orders**: A new Firestore collection `clientOrders` will store order details. Each document will have `customerId`, `orderId`, `date`, `amount`, `status`, `items`, etc. (This might also be derived from existing `projects` if `client` field in `projects` can be reliably linked to `customerId`).
-   **Tags**: Tags can be stored as an array of strings within the `Customer` document or in a separate `clientTags` sub-collection if more complex tag management is required.

## 4. Component Structure

-   **`ClientProfile.tsx`**: This will be the main component for displaying a single client's detailed profile. It will receive a `customerId` as a prop (or derive it from the `activeView` state).
-   **Sub-components within `ClientProfile.tsx`**: To maintain reusability and clean architecture, the `ClientProfile` component will compose several smaller, focused components:
    -   `ClientCard.tsx`: Displays basic client information (name, email, company, status, avatar, etc.).
    -   `ClientHistory.tsx`: Lists historical interactions.
    -   `ClientNotes.tsx`: Displays and allows adding/editing notes.
    -   `ClientTimeline.tsx`: Aggregates and displays events from history, notes, and orders in chronological order.
    -   `ClientOrders.tsx`: Lists orders associated with the client.
    -   `ClientTags.tsx`: Manages tags for the client.

## 5. Routing and Navigation

-   **`App.tsx` Modification**: The `MainContent` component in `App.tsx` will be updated to include a new case in its `switch` statement to render `ClientProfile`. The `activeView` state will be modified to support a format like `clientProfile:{id}`.
-   **`Sidebar.tsx` Modification**: A new navigation item for 
Client Profile will be added to the `navItems` array in `Sidebar.tsx` if it's a top-level navigation item, or a mechanism to navigate to a client profile from the `Customers.tsx` list will be implemented, passing the `customerId` to `App.tsx`'s `setActiveView` function.

## 6. Implementation Details

-   **`ClientProfile.tsx`**: This component will fetch the client's data using `dataService.getDocument('customers', customerId)`. It will then render the sub-components, passing relevant data as props.
-   **Sub-components**: Each sub-component will be responsible for its own data fetching (if needed, e.g., `ClientNotes` fetching notes for a specific `customerId`) and rendering, adhering to the existing UI patterns (e.g., card-based layouts, input fields, buttons).
-   **Data Service Extensions**: `dataService.ts` will be extended with new methods to handle the new collections (`clientHistory`, `clientNotes`, `clientOrders`, `clientTags`) for CRUD operations.
-   **UI Consistency**: TailwindCSS will be used to maintain consistency with the existing design system. Reusable components like buttons, input fields, and cards will be leveraged.

## 7. Testing Strategy

-   **Unit Tests**: Individual components and `dataService` methods will be tested to ensure they function as expected.
-   **Integration Tests**: The interaction between `App.tsx`, `Sidebar.tsx`, `Customers.tsx`, and `ClientProfile.tsx` (and its sub-components) will be tested to ensure seamless navigation and data flow.
-   **Manual Testing**: The feature will be manually tested across different screen sizes and user roles to ensure responsiveness and correct permissions.

## 8. Future Considerations

-   **Search Functionality**: Implement search within client notes, history, and orders.
-   **Filtering and Sorting**: Add advanced filtering and sorting options for history, notes, and orders.
-   **Permissions**: Implement role-based access control for different sections of the client profile.

## References

[1] joCRMNEWS GitHub Repository: [https://github.com/nurillayevjamshid/joCRMNEWS](https://github.com/nurillayevjamshid/joCRMNEWS)
