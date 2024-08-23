Simple project for a minimal reproduction of the issue described in https://github.com/prisma/prisma/discussions/13170

## Steps to reproduce
- Clone this repository
- Run `npm install`
- Run `npx prisma db push`
- Run `npm run start`

## Expected behavior
The order in which the `create` and `deleteMany` operations inside the `prisma.user.update` function appear in the code should not affect the result of the operation.

## Actual behavior
Placing the `create` operation before the `deleteMany` operation results in a `Unique constraint failed` error because the `id` of the `Post` that is trying to create already exists in the database.

The code in the example shows how it works as intended when the `deleteMany` operation is placed before the `create` operation.
```typescript
await prisma.user.update({
    where: { id: 1 },
    data: {
      posts: {
        deleteMany: [
          {
            authorId: 1
          }
        ],
        create: [
          { title: 'Post 1', content: 'Content 1', id: 1 },
          { title: 'Post 2', content: 'Content 2', id: 2 },
        ],
      },
    },
  })
```

But when the `create` operation is placed before the `deleteMany` operation, the `Unique constraint failed` error is thrown.
```typescript
await prisma.user.update({
    where: { id: 1 },
    data: {
      posts: {
        create: [
          { title: 'Post 1', content: 'Content 1', id: 1 },
          { title: 'Post 2', content: 'Content 2', id: 2 },
        ],
        deleteMany: [
          {
            authorId: 1
          }
        ],
      },
    },
  })
```
