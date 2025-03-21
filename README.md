# User Track
## Setup
1) run
```
yarn
npx prisma generate
npx prisma migrate deploy
yarn start:dev
```
2) access
```
http://localhost:3000/api
```

3) call to add countries
```
http://localhost:3000/import-countries
```

4) seed user
```
npx prisma db seed
```