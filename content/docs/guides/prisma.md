---
title: Connect from Prisma to Neon
subtitle: Learn how to connect to Neon from Prisma
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
  - /docs/guides/prisma-guide
---

Prisma is an open-source, next-generation ORM that enables you to manage and interact with your database. This guide explains how to connect Prisma to Neon, establish connections when using Prisma Client in serverless functions, and resolve [connection timeout](#connection-timeouts) issues.

To configure Prisma Migrate with Neon, see [Use Prisma Migrate with Neon](../guides/prisma-migrate).

## Prerequisites

- A Neon project. See [Create a project](../manage/projects#create-a-project).
- A Prisma project. See [Set up Prisma](https://www.prisma.io/docs/getting-started/setup-prisma), in the _Prisma documentation_.

## Connect to Neon from Prisma

To establish a basic connection from Prisma to Neon, perform the following steps:

1. Retrieve your Neon connection string. In the **Connection Details** widget on the Neon **Dashboard**, select a branch, a user, and the database you want to connect to. A connection string is constructed for you.
  ![Connection details widget](/docs/connect/connection_details.png)
  The connection string includes the user name, password, hostname, and database name.

2. Add the following lines to your `prisma/schema.prisma` file to identify the data source and database URL:

   ```typescript
   datasource db {
     provider = "postgresql"
     url   = env("DATABASE_URL")
   }
   ```

3. Add a `DATABASE_URL` variable to your `.env` file and set it to the Neon connection string that you copied in the previous step. Your setting will appear similar to the following:

   <CodeBlock shouldWrap>

   ```text
   DATABASE_URL="postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb"
   ```

   </CodeBlock>

<Admonition type="important">
If you are using Prisma Client from a serverless function, see [Connect from serverless functions](#connect-from-serverless-functions). To adjust your connection string to avoid connection timeouts issues, see [Connection timeouts](#connection-timeouts).
</Admonition>

## Connect from serverless functions

Serverless functions typically require a large number of database connections. When connecting from Prisma Client to Neon from a serverless function, you should use a pooled connection string. Neon uses the PgBouncer connection pooler, which maintains a pool of connections to the database, allowing Neon to support a large number of concurrent connections.

To use a pooled connection from Prisma, adjust your Neon connection string by adding a `-pooler` suffix to the endpoint ID and appending the `?pgbouncer=true` flag to the connection string, as shown:

<CodeBlock shouldWrap>

```text
DATABASE_URL=postgres://daniel:<password>@ep-mute-rain-952417-pooler.us-east-2.aws.neon.tech:5432/neondb?pgbouncer=true`
```

</CodeBlock>

The `-pooler` suffix tells Neon to use a pooled connection rather than a direct connection. The `?pgbouncer=true` flag requires that the connection uses PgBouncer.

<Admonition type="info">
The **Connection Details** widget on the Neon **Dashboard** provides a **Pooled connection** tab with a pooled connection string that you can copy and paste.
</Admonition>

For more information about PgBouncer and pooled connection strings, see [Enable connection pooling](../connect/connection-pooling#enable-connection-pooling). For related information in the _Prisma documentation_, refer to [Add pgbouncer to the connection URL](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).

## Connection timeouts

A connection timeout that occurs when connecting from Prisma to Neon causes an error similar to the following:

<CodeBlock shouldWrap>

```text
Error: P1001: Can't reach database server at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`
Please make sure your database server is running at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`.
```

</CodeBlock>

This error most likely means that the Prisma query engine timed out before the Neon compute was activated.

A Neon compute has two main states: _Active_ and _Idle_. Active means that the compute is currently running. If there is no query activity for 5 minutes, Neon places a compute into an idle state by default.

When you connect to an idle compute from Prisma, Neon automatically activates it. Activation typically happens within a few seconds but added latency can result in a connection timeout. To address this issue, your can adjust your Neon connection string by adding a `connect_timeout` parameter. This parameter defines the maximum number of seconds to wait for a new connection to be opened. The default value is 5 seconds. A higher setting should provide the time required to avoid connection timeout issues. For example:

<CodeBlock shouldWrap>

```text
DATABASE_URL=postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb?connect_timeout=10`
```

</CodeBlock>

<Admonition type="note">
A `connect_timeout` setting of 0 means no timeout.
</Admonition>

Another possible cause of connection timeouts is [Prisma's connection pool](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/), which has a default timeout of 10 seconds. This is typically enough time for Neon, but if you are still experiencing connection timeouts, you can try increasing this limit (in addition to the `connect_timeout` setting described above) by setting the `pool_timeout` parameter to a higher value. For example:

<CodeBlock shouldWrap>

```text
DATABASE_URL=postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb?connect_timeout=15&pool_timeout=15`
```

</CodeBlock>
  
For additional information about connecting from Prisma, refer to the following resources in the _Prisma documentation_:

- [Connection management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Database connection issues](https://www.prisma.io/dataguide/managing-databases/database-troubleshooting#database-connection-issues)
- [PostgreSQL database connector](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Increasing the pool timeout](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#increasing-the-pool-timeout)

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
