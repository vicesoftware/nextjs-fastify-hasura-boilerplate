# Updated Initial Development Stories <!-- omit in toc -->

## 📋 Ticket Status Tracking

**Status Key:**

- 📝 **Ready** - Ready to be picked up
- 🚧 **In Progress** - Currently being worked on
- 👀 **Under Review** - Code complete, needs review
- 🧪 **Ready for Test** - Approved, ready for testing
- ✅ **Deployed** - Live in production

**Priority Key:**

- 🔥 **Critical** - Must be done first
- ⚡ **High** - Important for core functionality
- 📋 **Medium** - Standard priority
- 📝 **Low** - Nice to have

---

## Epic 1: Authentication Setup with WorkOS

### 📝 PEG-1 [BACKEND] WorkOS Integration Setup

**Epic:** epic:auth | **Stack:** stack:backend | **Priority:** 🔥 Critical

**Description:**
Set up WorkOS integration for authentication including social login providers (Google, Apple, Facebook).

**Acceptance Criteria:**

- [ ] WorkOS account configured with social providers
- [ ] Environment variables set up for all environments
- [ ] Basic auth endpoints working (`/auth/login`, `/auth/callback`, `/auth/logout`)
- [ ] User creation on first login
- [ ] JWT token generation and validation

**API Endpoints:**

- `POST /api/auth/login` - Initiate login flow
- `GET /api/auth/callback` - Handle OAuth callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

---

### 📝 PEG-2 [FRONTEND] Authentication UI Components

**Epic:** epic:auth | **Stack:** stack:frontend | **Priority:** 🔥 Critical

**Description:**
Create authentication UI using WorkOS Lock or custom components for login/signup flow.

**UI Design Note:** Focus on functionality only. Do not spend significant time on look and feel until UX designs are ready.

**Acceptance Criteria:**

- [ ] Login/signup page with social login buttons
- [ ] Loading states during authentication
- [ ] Error handling for failed authentication
- [ ] Redirect to appropriate page after login
- [ ] Logout functionality

**Components:**

- `LoginPage` component
- `AuthProvider` context
- `ProtectedRoute` wrapper
- Social login buttons

---

### 📝 PEG-3 [SPIKE] User Roles and Event-Scoped Permissions Research

**Epic:** epic:auth | **Stack:** stack:backend | **Priority:** 🔥 Critical

**Description:**
Research and design the role system architecture to support multi-role users with event-specific scoping.

**Research Questions:**

- How should roles be structured? (User → Roles → Event scope vs global roles)
- What permissions are needed at each level?
- How do event-specific roles work? (e.g., rider for Event A, organizer for Event B)
- What's the relationship between organizations and roles?
- How do we handle role inheritance and conflicts?

**Expected Structure to Investigate:**

```
User
├── Roles[]
│   ├── Rider (optional role)
│   │   ├── Event (optional scope)
│   │   └── Rider-specific data
│   ├── Organizer
│   │   └── Organizer-specific data
│   └── Trainer, etc.
```

**Deliverables:**

- [ ] Role architecture diagram
- [ ] Database schema proposal
- [ ] Permission matrix (role × action)
- [ ] Event-scoping mechanism design
- [ ] API design for role management

**Time Box:** 3-5 days

---

### 📝 PEG-4 [FRONTEND] Basic Role Selection Interface

**Epic:** epic:auth | **Stack:** stack:frontend | **Priority:** 📋 Medium

**Description:**
Create placeholder onboarding flow for role selection (will be updated after PEG-3 spike).

**UI Design Note:** Focus on functionality only. Do not spend significant time on look and feel until UX designs are ready.

**Acceptance Criteria:**

- [ ] Simple role selection checkboxes/buttons
- [ ] Skip option for later completion
- [ ] Basic validation
- [ ] Ready to be refactored based on spike results

**Note:** This ticket is blocked by PEG-3 spike completion.

---

### 📝 PEG-5 [BACKEND] Invite Flow System

**Epic:** epic:auth | **Stack:** stack:backend | **Priority:** 📋 Medium

**Description:**
Build system for users to invite others via email with role assignments using Resend for email delivery.

**Micro-Service Architecture Note:** Design as standalone service that could be extracted later. Use Hasura auto-CRUD where appropriate for invitation management.

**Acceptance Criteria:**

- [ ] Invitation model and database table
- [ ] Email sending via **Resend integration**
- [ ] Invitation acceptance flow
- [ ] Invitation expiration (7 days)
- [ ] Invitation status tracking
- [ ] Resend webhook handling for delivery status

**API Endpoints:**

- `POST /api/invitations` - Send invitation
- `GET /api/invitations/:token` - Get invitation details
- `POST /api/invitations/:token/accept` - Accept invitation

---

### 📝 PEG-6 [FRONTEND] Invite Flow UI

**Epic:** epic:auth | **Stack:** stack:frontend | **Priority:** 📋 Medium

**Description:**
Create UI for sending and managing invitations.

**UI Design Note:** Focus on functionality only. Do not spend significant time on look and feel until UX designs are ready.

**Acceptance Criteria:**

- [ ] Basic invite form with email input
- [ ] Simple invitation list/status page
- [ ] Invitation acceptance page
- [ ] Basic error handling and feedback

---

## Epic 2: Organization CRUD

### 📝 PEG-7 [BACKEND] Organization Management APIs

**Epic:** epic:organizations | **Stack:** stack:backend | **Priority:** ⚡ High

**Description:**
Create CRUD APIs for organizations using Hasura auto-CRUD capabilities where possible, following micro-service ready architecture.

**Micro-Service Architecture Note:** Design organization service as standalone module. Leverage Hasura for basic CRUD operations, custom resolvers for complex business logic.

**Acceptance Criteria:**

- [ ] Organization model with owner/member relationships
- [ ] Hasura auto-generated CRUD endpoints
- [ ] Custom resolvers for member management
- [ ] Organization-level permissions via Hasura roles
- [ ] Service can operate independently

**Database Schema:**

```sql
organizations: {
  id: uuid,
  name: string,
  description: text,
  owner_id: uuid,
  created_at: timestamp
}

organization_members: {
  organization_id: uuid,
  user_id: uuid,
  role: string,
  joined_at: timestamp
}
```

**Hasura Auto-CRUD + Custom Endpoints:**

- Auto: Basic CRUD via Hasura GraphQL
- Custom: `POST /api/organizations/:id/members` - Add member
- Custom: `DELETE /api/organizations/:id/members/:userId` - Remove member

---

### 📝 PEG-8 [FRONTEND] Organization Management Interface

**Epic:** epic:organizations | **Stack:** stack:frontend | **Priority:** ⚡ High

**Description:**
Build UI for creating and managing organizations.

**UI Design Note:** Focus on functionality only. Do not spend significant time on look and feel until UX designs are ready.

**Acceptance Criteria:**

- [ ] Basic organization creation form
- [ ] Simple organization list/dashboard
- [ ] Basic member management (add/remove)
- [ ] Organization switching dropdown
- [ ] Works on mobile (basic responsive)

**Components:**

- `CreateOrganizationForm` (basic)
- `OrganizationDashboard` (functional)
- `MemberManagement` (simple)
- `OrganizationSwitcher` (dropdown)

---

## Epic 3: Event CRUD

### 📝 PEG-9 [BACKEND] Event Management APIs

**Epic:** epic:events | **Stack:** stack:backend | **Priority:** 🔥 Critical

**Description:**
Create comprehensive event management system leveraging Hasura auto-CRUD for basic operations, custom resolvers for complex business logic.

**Micro-Service Architecture Note:** Design event service as standalone module. Use Hasura for basic CRUD, custom services for publishing workflow and complex queries.

**Acceptance Criteria:**

- [ ] Event model with draft/published states
- [ ] Classes and divisions management via Hasura
- [ ] Fee structure using auto-CRUD
- [ ] Custom publishing workflow service
- [ ] Event search/filter custom resolvers

**Database Schema:**

```sql
events: {
  id: uuid,
  organization_id: uuid,
  name: string,
  description: text,
  start_date: date,
  end_date: date,
  location: string,
  status: enum(draft, published, cancelled),
  created_at: timestamp
}

event_classes: {
  id: uuid,
  event_id: uuid,
  name: string,
  division: string,
  entry_fee: decimal,
  max_entries: integer
}

event_fees: {
  id: uuid,
  event_id: uuid,
  name: string,
  amount: decimal,
  mandatory: boolean,
  per_horse: boolean
}
```

**Hasura Auto-CRUD + Custom Services:**

- Auto: Basic event/class/fee CRUD via Hasura
- Custom: `PUT /api/events/:id/publish` - Publishing workflow
- Custom: `GET /api/events/search` - Advanced search/filtering

---

### 📝 PEG-10 [FRONTEND] Event Creation Interface

**Epic:** epic:events | **Stack:** stack:frontend | **Priority:** 🔥 Critical

**Description:**
Basic event creation interface focusing on core functionality.

**UI Design Note:** Focus on functionality only. Do not spend significant time on look and feel until UX designs are ready.

**Acceptance Criteria:**

- [ ] Simple event creation form (single page for now)
- [ ] Basic class management (add/remove/edit)
- [ ] Simple fee management
- [ ] Draft save functionality
- [ ] Basic event preview
- [ ] Publish button

**Components:**

- `EventCreationForm` (basic form)
- `ClassList` (simple add/edit)
- `FeeList` (simple add/edit)
- `EventPreview` (basic display)

---

### 📝 PEG-11 [FRONTEND] Event Discovery Interface

**Epic:** epic:events | **Stack:** stack:frontend | **Priority:** ⚡ High

**Description:**
Basic event browsing and searching for riders.

**UI Design Note:** Focus on functionality only. Do not spend significant time on look and feel until UX designs are ready.

**Acceptance Criteria:**

- [ ] Simple event listing page
- [ ] Basic filters (date, location)
- [ ] Event detail page (basic layout)
- [ ] Search by name functionality
- [ ] Basic event cards

**Components:**

- `EventList` (simple list)
- `EventFilters` (basic filters)
- `EventCard` (functional card)
- `EventDetails` (basic layout)

---

## Epic 4: Rider CRUD (Pending Role Spike)

### 📝 PEG-12 [BACKEND] User Profile Foundation

**Epic:** epic:profiles | **Stack:** stack:backend | **Priority:** 📋 Medium

**Description:**
Create basic user profile system that will be extended based on role spike results (PEG-3).

**Note:** This ticket is blocked by PEG-3 spike completion. Design will follow the role architecture determined in the spike.

**Micro-Service Architecture Note:** Design profile service to support the role structure from PEG-3 spike.

**Preliminary Acceptance Criteria:**

- [ ] Basic user profile model
- [ ] Profile CRUD via Hasura auto-CRUD
- [ ] Foundation for role-specific data extensions
- [ ] Designed to support event-scoped roles

**Blocked By:** PEG-3 (Role Architecture Spike)

---

### 📝 PEG-13 [FRONTEND] Basic Profile Interface

**Epic:** epic:profiles | **Stack:** stack:frontend | **Priority:** 📋 Medium

**Description:**
Basic profile management interface (will be updated after role spike).

**UI Design Note:** Focus on functionality only. Do not spend significant time on look and feel until UX designs are ready.

**Note:** This ticket is blocked by PEG-3 spike completion.

**Blocked By:** PEG-3 (Role Architecture Spike)

---

### 📝 PEG-14 [BACKEND] Horse Management APIs

**Epic:** epic:profiles | **Stack:** stack:backend | **Priority:** 📝 Low

**Description:**
Horse profile management system using Hasura auto-CRUD.

**Note:** This ticket is blocked by PEG-3 spike to understand how horse ownership relates to roles.

**Micro-Service Architecture Note:** Design as standalone horse service with clear ownership models.

**Blocked By:** PEG-3 (Role Architecture Spike)

---

### 📝 PEG-15 [FRONTEND] Horse Management Interface

**Epic:** epic:profiles | **Stack:** stack:frontend | **Priority:** 📝 Low

**Description:**
Basic horse profile management.

**UI Design Note:** Focus on functionality only. Do not spend significant time on look and feel until UX designs are ready.

**Blocked By:** PEG-3 (Role Architecture Spike)

---

## Getting Started Checklist

### Infrastructure Prerequisites

- [ ] Set up development environment with Hasura
- [ ] Configure WorkOS account
- [ ] Set up Resend account for email delivery
- [ ] Set up database and Hasura migrations
- [ ] Configure CI/CD pipeline

### Week 1 Priority Order

1. **PEG-1** (WorkOS setup) - Critical blocker
2. **PEG-3** (Role spike) - Architectural decision needed
3. **PEG-7** (Organization APIs) - Can proceed in parallel
4. **PEG-2** (Auth UI) - Basic implementation

### Architectural Notes

- **Hasura Auto-CRUD:** Use for basic operations, custom resolvers for complex business logic
- **Micro-Service Ready:** Each epic should be designed as potentially standalone service
- **UI Placeholder Approach:** Functional-first, design overlay later
- **Email Integration:** All email sending through Resend

Would you like me to adjust any of these stories or add additional spike tickets for other architectural decisions?
