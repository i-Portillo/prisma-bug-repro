import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

	await prisma.user.create({
		data: {
			id: 1,
			email: 'some.email.@email.com',
			posts: {
				create: [
					{ title: 'Post 1', content: 'Content 1', id: 1 },
					{ title: 'Post 2', content: 'Content 2', id: 2 },
				]
			}
		},
	})

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

	const firstUpdate = await prisma.user.findUnique({
		where: { id: 1 },
		include: {
			posts: true,
		},
	})

	console.log('First update', firstUpdate?.posts)

	await prisma.user.update({
		where: { id: 1 },
		data: {
			posts: {
				create: [
					{ title: 'Post 1', content: 'Content 1', id: 1 },
					{ title: 'Post 2', content: 'Content 2', id: 2 },
				],
				deleteMany: {
					id: {
						in: [1, 2]
					}
				},
			},
		},
	})

	const secondUpdate = await prisma.user.findUnique({
		where: { id: 1 },
		include: {
			posts: true,
		},
	})

	// It's never going to reach this point
	console.log('Second update', secondUpdate?.posts)

}

main().catch(e => {
	throw e
}).finally(async () => {
	await prisma.$disconnect()
});