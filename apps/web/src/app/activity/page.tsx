import { ActivityFeed } from "@/components/activity/ActivityFeed";

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Activity Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Real-time activity monitoring powered by Hasura&apos;s
                auto-generated GraphQL API
              </p>
            </div>
            <a
              href="/tutorial"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
            >
              <span className="text-lg">📚</span>
              <span>How It Works</span>
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">🚀</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Auto-Generated
                </h3>
                <p className="text-2xl font-semibold text-gray-900">CRUD API</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Zero manual GraphQL schema writing
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">⚡</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Real-time</h3>
                <p className="text-2xl font-semibold text-gray-900">Updates</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Live activity feed with auto-refresh
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Production
                </h3>
                <p className="text-2xl font-semibold text-gray-900">Ready</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Auto-sync deployment workflow
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Hasura Features Demonstrated
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-lg">✅</span>
              <div>
                <h3 className="font-medium text-gray-900">
                  Auto-Generated Queries
                </h3>
                <p className="text-sm text-gray-600">
                  Complex filtering, sorting, pagination without writing SQL
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-lg">✅</span>
              <div>
                <h3 className="font-medium text-gray-900">
                  Auto-Generated Mutations
                </h3>
                <p className="text-sm text-gray-600">
                  Insert, update, delete operations with conflict resolution
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-lg">✅</span>
              <div>
                <h3 className="font-medium text-gray-900">Bulk Operations</h3>
                <p className="text-sm text-gray-600">
                  Efficient bulk inserts and updates
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-lg">✅</span>
              <div>
                <h3 className="font-medium text-gray-900">Type Safety</h3>
                <p className="text-sm text-gray-600">
                  End-to-end TypeScript from database to frontend
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed limit={50} refreshInterval={3000} />

        {/* API Information */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">API Endpoints</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex items-center space-x-3">
              <span className="bg-green-600 px-2 py-1 rounded text-xs">
                GET
              </span>
              <code>/api/activities</code>
              <span className="text-gray-300">
                - Recent activities using Hasura auto-generated query
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-blue-600 px-2 py-1 rounded text-xs">
                POST
              </span>
              <code>/api/activities/bulk</code>
              <span className="text-gray-300">
                - Bulk activity logging via Hasura mutations
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-purple-600 px-2 py-1 rounded text-xs">
                POST
              </span>
              <code>/api/hasura/sync</code>
              <span className="text-gray-300">
                - Auto-track new database tables
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-yellow-600 px-2 py-1 rounded text-xs">
                GET
              </span>
              <code>/api/hasura/status</code>
              <span className="text-gray-300">
                - Check Hasura connection and tracked tables
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
