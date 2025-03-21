# User Track

## Setup

1. run

```
yarn
npx prisma generate
npx prisma migrate deploy
yarn start:dev
```

2. access

```
http://localhost:3000/api
```

3. call to add countries

```
http://localhost:3000/import-countries
```

4. seed user

```
npx prisma db seed
```

5. sample SQL

- to get near me

```
SELECT
    u.id AS user_id,
    u.email,
    u.name AS user_name,
    l.latitude,
    l.longitude,
    c.name AS country_name,  -- Fixed the alias for country name
    ST_AsText(l.coordinates) AS location,
    ST_Distance(l.coordinates, ST_SetSRID(ST_MakePoint(76.20321, 34.353837), 4326)::geography) AS distance  -- Cast to geography for distance in meters
FROM
    "user" u
JOIN
    "location" l ON u.id = l."userId"
JOIN
    "country" c ON ST_Within(l.coordinates, c.coordinates)
WHERE
    -- c.name = 'India'
    ST_Distance(l.coordinates, ST_SetSRID(ST_MakePoint(76.353702, 34.578117	), 4326)::geography) <= 300000  -- 300000 meter radius
-- ORDER BY
--     distance ASC;
```
