# Suggestions Feature - Setup Guide

## Quick Start

### 1. Database Migration

Run the SQL migration to create the required tables:

```bash
# Connect to your database and run:
psql -U your_username -d your_database -f migrations/add_suggestions_feature.sql

# Or if using a GUI tool (pgAdmin, TablePlus, etc.):
# - Open migrations/add_suggestions_feature.sql
# - Execute the SQL script
```

### 2. Verify Installation

The feature is already integrated into your application. No additional configuration needed!

**New Routes:**
- `/suggestions` - Main suggestions feed page

**New Components:**
- `SuggestionForm` - Reusable form component
- Profile page now includes "Send Suggestion" button

### 3. Test the Feature

1. **Navigate to your profile page** (`/profile/[your-qr-code]`)
2. **Click "Send Suggestion"** button
3. **Write a suggestion** and choose anonymous or named submission
4. **Submit** and view it on the `/suggestions` page
5. **Like suggestions** by clicking the heart icon

## Features Overview

✅ **Submit Suggestions** - From profile or suggestions page  
✅ **Anonymous Option** - Choose to submit with or without your name  
✅ **Like/Unlike** - Upvote suggestions you support  
✅ **Responsive Design** - Works beautifully on mobile and desktop  
✅ **Real-time Updates** - Optimistic UI updates for instant feedback  
✅ **Premium UI** - Matches your app's design system  

## File Structure

```
app/
├── suggestions/
│   ├── page.tsx                 # Server component (fetches data)
│   └── suggestions-client.tsx   # Client component (interactive feed)
components/
└── SuggestionForm.tsx           # Reusable form component
lib/
└── actions.ts                   # Server actions (createSuggestion, toggleLike, etc.)
db/
└── schema.ts                    # Database schema (suggestions, suggestionLikes)
migrations/
└── add_suggestions_feature.sql  # Database migration
docs/
└── SUGGESTIONS_FEATURE.md       # Full documentation
```

## Customization

### Change Character Limit

Edit `components/SuggestionForm.tsx`:

```tsx
// Line ~75
<p className="text-xs text-muted-foreground">
    {content.length} / 500 characters  // Change 500 to your desired limit
</p>
```

### Modify Suggestion Card Appearance

Edit `app/suggestions/suggestions-client.tsx`:

```tsx
// Starting around line 100
<div className="group relative p-6 rounded-[2rem] ...">
    {/* Customize styling here */}
</div>
```

### Add Filtering/Sorting

Extend `getSuggestions()` in `lib/actions.ts` to accept filter parameters:

```typescript
export async function getSuggestions(
    currentUserId?: string,
    sortBy?: 'newest' | 'most-liked'
) {
    // Add sorting logic
}
```

## Troubleshooting

### "Cannot find module './suggestions-client'"

This is a TypeScript cache issue. Try:
```bash
# Clear TypeScript cache
rm -rf .next
pnpm dev
```

### Suggestions not showing

1. Check database connection
2. Verify migration ran successfully
3. Check browser console for errors
4. Ensure user is authenticated (has qrCodeId cookie)

### Likes not updating

1. Check network tab for failed requests
2. Verify `toggleSuggestionLike` action is being called
3. Check database for `suggestion_likes` table

## Next Steps

Consider adding:
- **Admin moderation panel** - Review/approve suggestions
- **Categories** - Organize suggestions by topic
- **Search functionality** - Find specific suggestions
- **Email notifications** - Notify when suggestions are liked
- **Status tracking** - Mark as "Under Review", "Implemented", etc.

## Support

For detailed documentation, see: `docs/SUGGESTIONS_FEATURE.md`
