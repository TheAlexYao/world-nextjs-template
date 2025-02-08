# Receipt Split Demo Implementation

## Current Status
🚧 Implementing Phase 1: Receipt UI
- Working on ScanButton component

## Core Features
1. Receipt Scanning
   - [WIP] Camera button in chat
   - [ ] Scanning animation
   - [ ] Show mock receipt

2. Split Request
   - [ ] Show receipt details
   - [ ] Fixed 0.1 WLD amount
   - [ ] Participant list
   - [ ] Join/Pay buttons

3. Payment Flow
   - [ ] World ID wallet integration
   - [ ] Payment confirmation
   - [ ] Success state

## Implementation Steps

### Phase 1: Receipt UI
```typescript
// types/receipt.ts
type ReceiptData = {
  restaurant: string
  items: Array<{
    name: string
    price: number
  }>
  subtotal: number
  total: number
  currency: string
}

// Mock data (simplified from duck receipt)
const MOCK_RECEIPT: ReceiptData = {
  restaurant: "YUMMY ROAST ENTERPRISE",
  items: [
    { name: "Duck(1/4Lower)", price: 21.00 },
    { name: "Canto Style Hor Fun", price: 11.90 },
    { name: "Wantan Noodle(D)", price: 8.90 },
    { name: "Soup Of The Day", price: 11.00 },
    { name: "Plain Water", price: 1.60 }
  ],
  subtotal: 54.40,
  total: 60.55,
  currency: "RM"
}
```

Tasks:
1. Create components:
   - [WIP] ScanButton
     ```tsx
     // components/Receipt/ScanButton.tsx
     // Status: Implementing
     // - Adding camera icon
     // - Styling button
     // - Adding click handler
     ```
   - [ ] ScanModal (animation + receipt)
   - [ ] ReceiptCard (display receipt)

2. Add animations:
   - [ ] Scanning effect
   - [ ] Progress indicator
   - [ ] Success state

### Phase 2: Split UI
```typescript
type SplitRequest = {
  id: string
  receipt: ReceiptData
  initiator: {
    userId: string
    username: string
    verification: "orb" | "phone"
  }
  participants: Array<{
    userId: string
    username: string
    verification: "orb" | "phone"
    hasJoined: boolean
    hasPaid: boolean
  }>
  status: "pending" | "completed"
}
```

Tasks:
1. Create SplitCard:
   - [ ] Participant list
   - [ ] Verification badges
   - [ ] Join/Pay buttons
   - [ ] Fixed 0.1 WLD amount

### Phase 3: Integration
1. Pusher Events:
   ```typescript
   const EVENTS = {
     SPLIT_REQUESTED: 'split-requested',
     SPLIT_JOINED: 'split-joined',
     SPLIT_PAID: 'split-paid'
   }
   ```

2. Tasks:
   - [ ] Broadcast split request
   - [ ] Handle joins
   - [ ] Track payments
   - [ ] Show completion

### Phase 4: Payment
1. Tasks:
   - [ ] Integrate Pay component
   - [ ] Set 0.1 WLD amount
   - [ ] Handle success/error

## User Flows

1. **Initiator**
```
Click camera ->
See animation ->
Show receipt ->
Watch others join/pay
```

2. **Participants**
```
See receipt ->
Join split ->
Pay 0.1 WLD
```

## UI States

1. **Initial**
- Camera button in chat
- No active splits

2. **Scanning**
- Modal overlay
- Animation
- Progress bar

3. **Split Active**
- Receipt details
- Participant list
- Join/Pay buttons

4. **Complete**
- All paid indicator
- Success message

## Testing Checklist
- [ ] Test camera button
- [ ] Verify animation
- [ ] Check receipt display
- [ ] Test multi-user join
- [ ] Verify payments
- [ ] Check completion 