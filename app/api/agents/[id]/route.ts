import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createQRCode } from '@/lib/qrcode'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) {
    return NextResponse.json({ error: 'Agent introuvable' }, { status: 404 })
  }
  return NextResponse.json(agent)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await request.json()
  const agent = await prisma.agent.update({
    where: { id },
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
    },
  })

  if (!agent.qrCode) {
    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const profileUrl = `${baseUrl}/profile/${agent.id}`
    const qrData = await createQRCode(profileUrl)
    await prisma.agent.update({ where: { id: agent.id }, data: { qrCode: qrData } })
  }

  return NextResponse.json({ success: true, agent })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.agent.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
