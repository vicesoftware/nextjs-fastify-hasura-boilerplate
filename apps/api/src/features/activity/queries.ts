// Feature-specific GraphQL operations for activity tracking
export const ACTIVITY_QUERIES = {
  CREATE_ACTIVITY: `
    mutation CreateActivity($activity: activity_log_insert_input!) {
      insert_activity_log_one(object: $activity) {
        id timestamp action
      }
    }
  `,

  CREATE_BULK_ACTIVITIES: `
    mutation CreateBulkActivities($activities: [activity_log_insert_input!]!) {
      insert_activity_log(objects: $activities) {
        returning { id timestamp action }
        affected_rows
      }
    }
  `,

  GET_RECENT_ACTIVITIES: `
    query GetRecentActivities($limit: Int!) {
      activity_log(order_by: {timestamp: desc}, limit: $limit) {
        id timestamp action
      }
    }
  `,

  GET_ACTIVITY_STATS: `
    query GetActivityStats($since: timestamptz!) {
      activity_log_aggregate(where: {timestamp: {_gte: $since}}) {
        aggregate { count }
      }
      recent_actions: activity_log(
        where: {timestamp: {_gte: $since}}
        distinct_on: action
        order_by: [{action: asc}, {timestamp: desc}]
      ) {
        action
      }
    }
  `,

  GET_ACTIVITY_COUNT: `
    query GetActivityCount {
      activity_log_aggregate {
        aggregate { count }
      }
    }
  `,
};
