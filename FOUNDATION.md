# RWA.MS Foundation — CHAT 00A

Reference screens: 56 Empty States, 57 Loading/Skeleton States, 58 Error States, 59 Permission/Policy State, and 72 Design System / Component Library.

These screenshots are treated as a reusable design-system reference, not as standalone pages. No route is created for them.

## Source of truth

- Central tokens: `src/styles/tokens.css`
- UI primitives: `src/components/ui/`
- App states: `src/components/states/`
- Global conventions: `src/app/globals.css`

## Included primitives

Button, Input, Select, Checkbox, Radio, Card, Badge, Tabs, Table, Alert, Toast, Tooltip, and Skeleton.

## Included application states

EmptyState, LoadingState, ErrorState, and PermissionState.

## Conventions

- Dark navy RWA.MS surfaces with centralized semantic colors.
- 4pt spacing rhythm.
- Shared radius, border, elevation and control-height tokens.
- Visible focus state, disabled state and validation states.
- Reduced-motion support.
- Responsive table overflow and adaptive state/loading layouts.

Future batches must reuse these primitives and tokens instead of creating duplicate local styles.
