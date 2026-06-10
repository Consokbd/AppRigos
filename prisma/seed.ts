import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const agents = [
  {
    matricule: 'RGS-001',
    nom: 'KABAMBA',
    postnom: 'MULUMBA',
    prenom: 'Jean',
    fonction: 'Superviseur HSE',
    service: 'Operations',
    telephone: '+243 810 000 001',
    email: 'jean.kabamba@rigos.com',
    statut: 'ACTIF',
    expiresAt: new Date('2027-01-30T00:00:00.000Z'),
  },
  {
    matricule: 'RGS-002',
    nom: 'MUTOMBO',
    postnom: 'KASONGO',
    prenom: 'Grace',
    fonction: 'Assistante administrative',
    service: 'Administration',
    telephone: '+243 810 000 002',
    email: 'grace.mutombo@rigos.com',
    statut: 'ACTIF',
    expiresAt: new Date('2027-01-30T00:00:00.000Z'),
  },
  {
    matricule: 'RGS-003',
    nom: 'ILUNGA',
    postnom: null,
    prenom: 'Patrick',
    fonction: 'Technicien',
    service: 'Maintenance',
    telephone: '+243 810 000 003',
    email: null,
    statut: 'INACTIF',
    expiresAt: new Date('2027-01-30T00:00:00.000Z'),
  },
]

async function main() {
  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { matricule: agent.matricule },
      update: agent,
      create: agent,
    })
  }

  console.log(`${agents.length} agents de demonstration prets.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
