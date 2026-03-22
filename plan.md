# Mission Control — Plan & Protocol

**Status:** In Progress
**Owner:** Astra
**Last Updated:** 2026-03-20

## Overview

This file documents the technical roadmap, communication protocol, and collaboration guidelines for Mission Control development.

## Current State

- ✅ MVP Tasks view (Kanban board)
- ✅ Activity feed (local storage)
- ✅ Task CRUD operations
- ✅ "Today's focus" pill
- ✅ Sidebar navigation scaffolding
- ❌ Plan.md missing (needs to be created)
- ❌ Communication protocol undefined
- ❌ TODO markers missing

## TODO Items

### High Priority
- [ ] Create plan.md with technical roadmap
- [ ] Define communication protocol with Alex
- [ ] Document debugging/development practices
- [ ] Add TODO/FIXME markers in code for future debugging

### Medium Priority
- [ ] Implement Calendar view
- [ ] Implement Projects view
- [ ] Add data persistence beyond localStorage (API/DB)
- [ ] Create production build configuration

### Low Priority
- [ ] Implement Memories view
- [ ] Implement Docs view
- [ ] Implement Team view
- [ ] Implement Office view
- [ ] Add multi-user authentication
- [ ] Sync with GitHub issues

## Communication Protocol

### Astra ↔ Alex Collaboration

**Channel:** Discord (TrustCore channel)
**Trigger:** When Astra needs Alex's input on technical decisions

#### When to Ask
- When implementation details are ambiguous
- When performance optimization is needed
- When integration points need clarification
- When architectural decisions require consensus

#### Request Format
```
**To:** @Alex
**Context:** [Brief description of what I'm doing]
**Question:** [Specific question or decision needed]
**My recommendation:** [If I have one]
```

#### Expected Response Format
- Direct answer
- Technical explanation if needed
- Code snippet if implementation is straightforward
- Follow-up questions if clarification needed

#### What to Include in Response
- ✅ What Alex is asking
- ✅ What I'm recommending (if any)
- ✅ My reasoning/analysis
- ✅ Final decision

### Astra ↔ Dave Collaboration

**Channel:** Direct chat (webchat)
**Trigger:** When decisions need human approval

#### When to Ask
- External changes (GitHub, Discord, email)
- Production deployment
- New dependencies or integrations
- Anything that leaves the local environment

#### Request Format
```
**Question:** [Question or approval request]
**Context:** [Brief context]
**Options:** [If applicable]
**My recommendation:** [If I have one]
```

#### Expected Response
- Dave's approval/denial
- Clarifications or alternative suggestions
- Final decision

## Development Practices

### Code Organization

#### File Naming Convention
- **Component files:** `ComponentName.tsx`
- **Utility files:** `usefulName.ts`
- **Types:** `types.ts` (if shared types)

#### Import Organization
1. React hooks
2. Next.js/React utilities
3. Custom components
4. Utils/helpers
5. Types

#### Comment Style
```typescript
// Good: Clear, explains WHY not WHAT
// TODO: This will be optimized later when performance testing reveals bottleneck

// Avoid: Obvious code
const count = 0; // this is a counter
```

### Debugging Practices

#### Before Submitting
1. ✅ Check for console errors
2. ✅ Test all interactions (create, move, delete tasks)
3. ✅ Verify localStorage persistence
4. ✅ Check responsive behavior (mobile/desktop)
5. ✅ Verify activity feed updates correctly

#### Error Handling
```typescript
// Use try-catch for localStorage operations
try {
  const data = JSON.parse(raw);
  return data as T;
} catch (e) {
  console.error(`Failed to parse ${key}:`, e);
  return fallback;
}
```

#### Console Logging
```typescript
// Use structured logging
console.log('[MissionControl] Task created:', task);
console.error('[MissionControl] Failed to save:', error);
```

## Testing Checklist

### Unit Tests (Future)
- [ ] Task creation with validation
- [ ] Task movement validation
- [ ] Activity feed generation
- [ ] "Today's focus" logic

### Integration Tests (Future)
- [ ] LocalStorage persistence across reloads
- [ ] Multiple tasks interaction
- [ ] Task status transitions

### Manual Testing
- [ ] Create task → verify appears in backlog
- [ ] Move task → verify updates status and activity
- [ ] Reload page → verify data persists
- [ ] Clear browser storage → verify resets
- [ ] Test on mobile view → verify responsive layout

## Security Considerations

### Data Privacy
- ✅ localStorage only (no external storage)
- ✅ No sensitive data in localStorage
- ✅ No PII stored

### Authentication (Future)
- [ ] Consider auth for multi-user scenarios
- [ ] Consider encrypting localStorage data
- [ ] Consider API-level security

## Deployment

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables (Future)
- PORT (default 3000)
- NODE_ENV (default development)
- API_BASE_URL (for backend integration)

## Next Steps

1. ✅ Review existing code (done)
2. ✅ Create plan.md (in progress)
3. ⏳ Ask Alex in Discord about:
   - Current implementation preferences
   - Priority improvements
   - Data persistence strategy
4. ⏳ Update code with TODO/FIXME markers
5. ⏳ Implement Calendar view
6. ⏳ Add debugging practices documentation

## Files to Review

- `README.md` — High-level concept and features
- `src/app/page.tsx` — Main Mission Control component
- `src/app/layout.tsx` — Root layout
- `src/app/globals.css` — Styling

## Questions for Alex

1. **Question:** Do you want me to ask Alex in Discord for specific guidance, or should I proceed with implementing the planned improvements?
2. **Question:** Should I add TODO/FIXME markers throughout the code now, or wait until after implementation?
3. **Question:** What's your preference for localStorage vs. backend persistence?
4. **Question:** Should I implement the Calendar view first, or focus on improving the Tasks view?