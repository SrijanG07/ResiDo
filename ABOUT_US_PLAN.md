# About Us Page Implementation Plan

## Overview

Add a professional "About Us" section to RoomGi website showcasing the team and institution.

---

## Page Content Structure

### 1. Hero Section

- Title: "About RoomGi"
- Tagline: "Building the Future of Real Estate Technology"
- Brief mission statement

### 2. Our Story Section

- Background on RoomGi development
- Vision and mission
- What makes us different

### 3. Team Section

Display team members in professional cards with photo placeholders, names, roles, and contact info.

#### Team Members:

| Name            | Email                       | Phone          | Role      |
| --------------- | --------------------------- | -------------- | --------- |
| Ridwan Umar     | ridwan.umar@iiitb.ac.in     | +91 8882451901 | Developer |
| Kshiteej Tiwari | kshiteej.tiwari@iiitb.ac.in | +91 7030333308 | Developer |
| Srijan Gupta    | srijan.gupta@iiitb.ac.in    | +91 9179646803 | Developer |

### 4. Institution Section

**International Institute of Information Technology Bangalore (IIIT-B)**

Address:

```
26/C, Opposite Infosys Gate 10
Electronics City Phase 1, Hosur Road
Bengaluru - 560100
Karnataka, India
```

### 5. Contact Section

- Email links
- Phone numbers
- Location map embed (optional)

---

## Navigation Update

Add "About Us" link to:

- Main header navigation (LuxuryHero.jsx)
- Footer links (LuxuryFooter.jsx)

---

## Design Guidelines

- Match existing luxury dark theme
- Professional typography
- Team member cards with hover effects
- Consistent spacing and animations
- Mobile responsive layout

---

## Files to Create/Modify

### New Files:

1. `frontend/src/pages/AboutUs.jsx` - Main About Us page component
2. `frontend/src/pages/AboutUs.css` - Styling for About Us page

### Files to Modify:

1. `frontend/src/App.jsx` - Add route for About Us
2. `frontend/src/components/LuxuryHero.jsx` - Add nav link
3. `frontend/src/components/LuxuryFooter.jsx` - Add footer link

---

## Implementation Status

- [ ] Create AboutUs.jsx component
- [ ] Create AboutUs.css styles
- [ ] Add route in App.jsx
- [ ] Update header navigation
- [ ] Update footer navigation
- [ ] Test responsiveness
