import Link from "next/link";

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Auto-Updating Activity Feed Tutorial
          </h1>
          <p className="mt-2 text-gray-600">
            Learn how real-time activity updates work with Hasura&apos;s
            auto-generated GraphQL API
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-4">
            <a
              href="/activity"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              📊 View Live Activity Dashboard
            </a>
            <a
              href="http://localhost:3001/activity-history"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              📖 Complete Documentation
            </a>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
          <p className="text-sm text-blue-600 mt-2">
            💡 For comprehensive implementation details, visit the documentation
            app at localhost:3001
          </p>
        </div>

        {/* Overview */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 mb-4">
            Our activity feed demonstrates{" "}
            <strong>polling-based real-time updates</strong> using Hasura&apos;s
            auto-generated GraphQL queries. Here&apos;s the complete data flow:
          </p>

          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
            <div className="space-y-2">
              <div>
                1. 🚀 <span className="text-blue-600">API Server</span> logs
                activities →{" "}
                <span className="text-green-600">Hasura GraphQL</span>
              </div>
              <div>
                2. 📊 <span className="text-purple-600">Frontend</span> polls
                every 3 seconds →{" "}
                <span className="text-green-600">Hasura GraphQL</span>
              </div>
              <div>
                3. 🔄 <span className="text-green-600">Hasura</span>{" "}
                auto-generates query →{" "}
                <span className="text-orange-600">PostgreSQL</span>
              </div>
              <div>
                4. 📡 Fresh data flows back →{" "}
                <span className="text-purple-600">Activity Feed Component</span>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Diagram */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Architecture Flow
          </h2>
          <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React/Next.js)                    │
├─────────────────────────────────────────────────────────────────┤
│  📱 ActivityFeed Component                                      │
│  ├── ⏰ useEffect() → setInterval(fetchActivities, 3000ms)      │
│  ├── 📡 fetch(\${NEXT_PUBLIC_API_URL}/activities)               │
│  └── 🔄 Auto-refresh every 3 seconds                           │
└─────────────────────────────────────────────────────────────────┘
                          │ HTTP GET Request
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway (Fastify)                       │
├─────────────────────────────────────────────────────────────────┤
│  🚀 GET /api/activities endpoint                               │
│  ├── 📝 hasuraService.getRecentActivities(limit)               │
│  └── 🔄 Returns formatted JSON response                        │
└─────────────────────────────────────────────────────────────────┘
                          │ GraphQL Query
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Hasura GraphQL Engine                       │
├─────────────────────────────────────────────────────────────────┤
│  🚀 AUTO-GENERATED Query (Zero Code Required!)                 │
│  ├── query GetRecentActivities($limit: Int = 20) {             │
│  │     activity_log(order_by: {timestamp: desc}, limit: $limit) │
│  │   }                                                         │
│  └── 🎯 Automatically handles: filtering, sorting, pagination  │
└─────────────────────────────────────────────────────────────────┘
                          │ SQL Query
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                         │
├─────────────────────────────────────────────────────────────────┤
│  🐘 activity_log table                                         │
│  ├── SELECT * FROM activity_log                                │
│  │   ORDER BY timestamp DESC LIMIT 20;                        │
│  └── 📊 Optimized with indexes for fast queries                │
└─────────────────────────────────────────────────────────────────┘
            `}</pre>
          </div>
        </section>

        {/* Code Walkthrough */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Code Implementation
          </h2>

          <div className="space-y-6">
            {/* Frontend Code */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                1. Frontend Auto-Refresh Logic
              </h3>
              <p className="text-gray-600 mb-3">
                The React component uses{" "}
                <code className="bg-gray-100 px-1 rounded">useEffect</code> and
                <code className="bg-gray-100 px-1 rounded">setInterval</code> to
                poll for updates:
              </p>
              <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">{`// apps/web/src/components/activity/ActivityFeed.tsx
const fetchActivities = async () => {
  try {
    const response = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/activities\`);
    const data = await response.json();
    
    if (data.success) {
      setActivities(data.data);  // 🔄 Update state with fresh data
    }
  } catch (err) {
    setError('Network error fetching activities');
  }
};

useEffect(() => {
  fetchActivities();  // 🚀 Initial load
  
  // ⏰ Set up auto-refresh every 3 seconds
  const interval = setInterval(fetchActivities, 3000);
  return () => clearInterval(interval);  // 🧹 Cleanup
}, []);`}</pre>
              </div>
            </div>

            {/* API Code */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                2. API Gateway Endpoint
              </h3>
              <p className="text-gray-600 mb-3">
                The API server provides a simple REST endpoint that calls
                Hasura:
              </p>
              <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">{`// apps/api/src/index.ts
app.get('/api/activities', async (request, reply) => {
  try {
    // 📡 Call Hasura&apos;s auto-generated query
    const activities = await hasuraService.getRecentActivities(20);
    
    return {
      success: true,
      data: activities,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return reply.status(500).send({
      success: false,
      error: 'Failed to fetch activities'
    });
  }
});`}</pre>
              </div>
            </div>

            {/* Hasura Query */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                3. Hasura Auto-Generated Query
              </h3>
              <p className="text-gray-600 mb-3">
                Hasura automatically creates this GraphQL query based on our
                database schema:
              </p>
              <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">{`// apps/api/src/lib/hasura-client.ts
export const GET_RECENT_ACTIVITIES = \`
  query GetRecentActivities($limit: Int = 20) {
    activity_log(
      order_by: {timestamp: desc}  # 📅 Sort by newest first
      limit: $limit                # 🔢 Limit results
    ) {
      id
      timestamp
      action
    }
  }
\`;

// 🚀 Zero manual SQL writing required!
// Hasura auto-generates this based on the activity_log table schema`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Hasura Benefits */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Why Hasura Makes This Easy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-xl">🚀</span>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Auto-Generated Queries
                  </h3>
                  <p className="text-sm text-gray-600">
                    No manual GraphQL schema writing. Hasura introspects your
                    database and creates queries automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-blue-500 text-xl">🔍</span>
                <div>
                  <h3 className="font-medium text-gray-900">Smart Filtering</h3>
                  <p className="text-sm text-gray-600">
                    Built-in operators like{" "}
                    <code className="bg-gray-100 px-1 rounded">_eq</code>,
                    <code className="bg-gray-100 px-1 rounded">_in</code>,
                    <code className="bg-gray-100 px-1 rounded">_gte</code> for
                    complex queries.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-purple-500 text-xl">📊</span>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Optimized Performance
                  </h3>
                  <p className="text-sm text-gray-600">
                    Hasura generates efficient SQL with proper joins and
                    indexes.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-orange-500 text-xl">⚡</span>
                <div>
                  <h3 className="font-medium text-gray-900">Real-time Ready</h3>
                  <p className="text-sm text-gray-600">
                    Easy upgrade to GraphQL subscriptions for true real-time
                    updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-red-500 text-xl">🔒</span>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Built-in Security
                  </h3>
                  <p className="text-sm text-gray-600">
                    Row-level permissions and role-based access control out of
                    the box.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-xl">🎯</span>
                <div>
                  <h3 className="font-medium text-gray-900">Type Safety</h3>
                  <p className="text-sm text-gray-600">
                    Generate TypeScript types from your GraphQL schema
                    automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upgrade to Real-time */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upgrading to True Real-time
          </h2>
          <p className="text-gray-600 mb-4">
            Currently we use polling (every 3 seconds). Here&apos;s how to
            upgrade to instant updates with GraphQL subscriptions:
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600 text-lg">💡</span>
              <div>
                <h3 className="font-medium text-yellow-800">
                  Future Enhancement
                </h3>
                <p className="text-yellow-700 text-sm">
                  This is planned for Phase 4: Real-time Subscriptions in our
                  implementation roadmap.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">{`// Future: GraphQL Subscription (instant updates)
const SUBSCRIBE_TO_ACTIVITIES = \`
  subscription SubscribeToActivities($limit: Int = 10) {
    activity_log(
      order_by: {timestamp: desc}
      limit: $limit
    ) {
      id
      timestamp
      action
    }
  }
\`;

// React component with real-time updates
const { data, loading } = useSubscription(SUBSCRIBE_TO_ACTIVITIES);
// 🚀 Updates instantly when new activities are added!`}</pre>
          </div>
        </section>

        {/* Performance Considerations */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Performance Considerations
          </h2>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">
                ✅ What We Did Right
              </h3>
              <ul className="text-green-700 text-sm space-y-1">
                <li>
                  • <strong>Database Indexes</strong>: Added indexes on
                  timestamp (DESC) and action columns
                </li>
                <li>
                  • <strong>Limit Queries</strong>: Always use LIMIT to prevent
                  large result sets
                </li>
                <li>
                  • <strong>Efficient Polling</strong>: 3-second intervals
                  balance freshness vs. server load
                </li>
                <li>
                  • <strong>Error Handling</strong>: Graceful fallbacks when
                  Hasura is unavailable
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">
                🔧 Production Optimizations
              </h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>
                  • <strong>Caching</strong>: Add Redis caching for frequently
                  accessed data
                </li>
                <li>
                  • <strong>Pagination</strong>: Implement cursor-based
                  pagination for large datasets
                </li>
                <li>
                  • <strong>Rate Limiting</strong>: Protect against excessive
                  polling
                </li>
                <li>
                  • <strong>WebSocket Subscriptions</strong>: Upgrade to true
                  real-time for better UX
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Try It Yourself */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Try It Yourself!</h2>
          <p className="mb-4">
            The activity feed is live and updating. Here are some ways to see it
            in action:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-medium mb-2">🔄 Watch Auto-Updates</h3>
              <p className="text-sm opacity-90">
                Open the Activity Dashboard and watch it refresh every 3 seconds
                with new data.
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-medium mb-2">📡 Generate Activities</h3>
              <p className="text-sm opacity-90">
                Visit the health check endpoint or make API calls to see new
                activities appear.
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-medium mb-2">🗄️ Check Database</h3>
              <p className="text-sm opacity-90">
                Use Drizzle Studio to see the raw data being inserted into the
                activity_log table.
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-medium mb-2">🚀 Test Hasura</h3>
              <p className="text-sm opacity-90">
                Visit the Hasura Console to explore the auto-generated GraphQL
                schema.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/activity"
              className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
            >
              📊 Activity Dashboard
            </a>
            <a
              href="http://localhost:8080"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 text-white px-4 py-2 rounded font-medium hover:bg-white/30 transition-colors"
            >
              🚀 Hasura Console
            </a>
            <a
              href="https://local.drizzle.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 text-white px-4 py-2 rounded font-medium hover:bg-white/30 transition-colors"
            >
              🗄️ Drizzle Studio
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
