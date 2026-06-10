import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createQRCode } from '@/lib/qrcode'
import { getServerAuthSession } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getServerAuthSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const url = new URL(request.url)
  const q = url.searchParams.get('q') ?? ''
  const agents = await prisma.agent.findMany({
    where: q
      ? {
          OR: [
            { nom: { contains: q, mode: 'insensitive' } },
            { postnom: { contains: q, mode: 'insensitive' } },
            { prenom: { contains: q, mode: 'insensitive' } },
            { matricule: { contains: q, mode: 'insensitive' } },
            { fonction: { contains: q, mode: 'insensitive' } },
            { service: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {},
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(agents)
}

export async function POST(request: Request) {
  const session = await getServerAuthSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const payload = await request.json()
  const agent = await prisma.agent.create({
    data: {
      matricule: payload.matricule,
      nom: payload.nom,
      postnom: payload.postnom || null,
      prenom: payload.prenom || null,
      fonction: payload.fonction,
      service: payload.service,
      telephone: payload.telephone || null,
      email: payload.email || null,
      photo: payload.photo || null,
      statut: payload.statut || 'ACTIF',
      expiresAt: payload.expiresAt ? new Date(`${payload.expiresAt}T00:00:00.000Z`) : null,
    },
  })

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const profileUrl = `${baseUrl}/profile/${agent.id}`
  const qrData = await createQRCode(profileUrl)
  await prisma.agent.update({ where: { id: agent.id }, data: { qrCode: qrData } })

  return NextResponse.json({ success: true, agent })
}
