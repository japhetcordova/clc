# Suggestions Feature Documentation

## Overview
The Suggestions feature allows community members to submit ideas, feedback, and suggestions to help improve the church community. Users can submit suggestions either with their name or anonymously, and other members can like (upvote) suggestions they support.

## Features

### 1. **Submit Suggestions**
- **From Profile Page**: Users can submit suggestions directly from their profile page via the "Send Suggestion" button
- **From Suggestions Page**: Users can also submit suggestions from the dedicated `/suggestions` page
- **Anonymous Option**: Users can choose to submit suggestions anonymously or with their name attached
- **Character Limit**: Suggestions are limited to 500 characters for clarity and conciseness

### 2. **View Suggestions Feed**
- **Canvas-Style UI**: Modern, card-based layout with premium aesthetics
- **Chronological Order**: Suggestions are displayed with newest first
- **Author Information**: Shows author name for non-anonymous suggestions, or "Anonymous" for anonymous ones
- **Timestamp**: Displays relative time (e.g., "2 hours ago") for each suggestion

### 3. **Like/Upvote System**
- **Interactive Likes**: Users can like suggestions they support
- **Toggle Functionality**: Click again to unlike
- **Like Count**: Displays total number of likes for each suggestion
- **Visual Feedback**: Heart icon fills when liked, with smooth animations

### 4. **Responsive Design**
- **Desktop**: Uses Dialog modal for suggestion submission
- **Mobile**: Uses Drawer (bottom sheet) for better mobile UX
- **Adaptive Layout**: Feed adjusts beautifully across all screen sizes

## Technical Implementation

### Database Schema

#### `suggestions` Table
```sql
- id: UUID (Primary Key)
- content: TEXT (The suggestion text)
- is_anonymous: BOOLEAN (Whether submitted anonymously)
- user_id: UUID (Foreign Key to users table)
- like_count: INTEGER (Cached count of likes)
- created_at: TIMESTAMP
```

#### `suggestion_likes` Table
```sql
- id: UUID (Primary Key)
- suggestion_id: UUID (Foreign Key to suggestions table)
- user_id: UUID (Foreign Key to users table)
- created_at: TIMESTAMP
- UNIQUE constraint on (suggestion_id, user_id)
```

### Server Actions

#### `createSuggestion(data)`
Creates a new suggestion in the database.

**Parameters:**
- `content`: string - The suggestion text
- `isAnonymous`: boolean - Whether to submit anonymously
- `userId`: string - ID of the user submitting

**Returns:**
- `{ success: boolean, suggestion?: Suggestion, error?: string }`

#### `toggleSuggestionLike(suggestionId, userId)`
Toggles a like on a suggestion (adds if not exists, removes if exists).

**Parameters:**
- `suggestionId`: string - ID of the suggestion
- `userId`: string - ID of the user liking/unliking

**Returns:**
- `{ success: boolean, liked?: boolean, error?: string }`

#### `getSuggestions(currentUserId?)`
Fetches all suggestions with enriched data (author info, like status).

**Parameters:**
- `currentUserId`: string (optional) - ID of the current user to check like status

**Returns:**
- `{ success: boolean, suggestions: EnrichedSuggestion[], error?: string }`

### Components

#### `SuggestionForm`
Reusable form component for submitting suggestions.

**Props:**
- `userId`: string - ID of the current user
- `onSuccess?`: () => void - Callback after successful submission
- `triggerButton?`: ReactNode - Custom trigger button (optional)

**Features:**
- Responsive (Dialog on desktop, Drawer on mobile)
- Anonymous/Named submission toggle
- Character counter
- Form validation
- Loading states

#### `SuggestionsClient`
Main client component for the suggestions feed page.

**Props:**
- `initialSuggestions`: Suggestion[] - Initial suggestions from server
- `currentUser`: User - Current logged-in user

**Features:**
- Displays suggestion feed
- Handles like/unlike interactions
- Optimistic UI updates
- Empty state handling

## Usage

### Adding Suggestion Button to a Page

```tsx
import SuggestionForm from "@/components/SuggestionForm";

// In your component:
<SuggestionForm userId={user.id} />

// With custom trigger button:
<SuggestionForm 
    userId={user.id}
    triggerButton={
        <Button>Custom Button Text</Button>
    }
/>
```

### Accessing the Suggestions Page

Navigate to `/suggestions` to view all community suggestions.

## Database Migration

Run the migration file to set up the required tables:

```bash
# Using your preferred database client, execute:
migrations/add_suggestions_feature.sql
```

Or if using Drizzle Kit:

```bash
pnpm drizzle-kit push
```

## Security Considerations

1. **Anonymous Submissions**: User ID is still stored for moderation purposes, but not displayed publicly
2. **Like Validation**: Unique constraint prevents duplicate likes from the same user
3. **Content Validation**: Server-side validation ensures suggestions are not empty
4. **User Authentication**: All actions require authenticated user (via cookie)

## Future Enhancements

Potential improvements for future versions:

1. **Admin Moderation**: Allow admins to review/approve/delete suggestions
2. **Categories**: Add categories for different types of suggestions
3. **Search & Filter**: Search suggestions by keyword, filter by most liked
4. **Notifications**: Notify users when their suggestions are liked or responded to
5. **Comments**: Allow discussion threads on suggestions
6. **Status Tracking**: Mark suggestions as "Under Review", "Implemented", etc.

## Styling & UX

The feature follows the application's premium design system:
- **Rounded corners**: 2rem border radius for cards
- **Smooth transitions**: All interactive elements have smooth hover/active states
- **Consistent spacing**: Uses the app's spacing scale
- **Color scheme**: Matches primary/accent colors
- **Typography**: Uses the app's font hierarchy
- **Shadows**: Subtle shadows for depth and hierarchy

## Accessibility

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: Proper labels for screen readers
- **Focus States**: Clear focus indicators
- **Color Contrast**: Meets WCAG AA standards
- **Responsive Text**: Text scales appropriately on all devices
