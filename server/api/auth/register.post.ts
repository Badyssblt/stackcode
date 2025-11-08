import prisma from "../../../lib/prisma"
import bcrypt from "bcryptjs"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, firstname, lastname } = body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw createError({ statusCode: 400, statusMessage: "User already exists" })

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hashed, firstname, lastname },
  })

  return { success: true, user: { id: user.id, email: user.email } }
})

