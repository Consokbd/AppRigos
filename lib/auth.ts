import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { Session, User } from 'next-auth'

const users = [
  {
    id: 'admin-1',
    name: 'Administrateur',
    email: process.env.ADMIN_EMAIL ?? 'admin@app-rigos.local',
    password: process.env.ADMIN_PASSWORD ?? 'Admin123!',
    role: 'ADMIN',
  },
  {
    id: 'operator-1',
    name: 'Opérateur',
    email: process.env.OPERATOR_EMAIL ?? 'operator@app-rigos.local',
    password: process.env.OPERATOR_PASSWORD ?? 'Operator123!',
    role: 'OPERATOR',
  },
]

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Identifiant',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = users.find(
          (item) => item.email === credentials.email && item.password === credentials.password,
        )

        if (!user) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as User & { role?: string }).role ?? 'OPERATOR'
      }
      return token
    },
    async session({ session, token }) {
      session.user = session.user ?? { name: 'Utilisateur', email: '' }
      ;(session.user as Session['user'] & { role?: string }).role = token.role as string
      return session as Session & { user: { role: string } }
    },
  },
}

export const getServerAuthSession = async () => {
  const { getServerSession } = await import('next-auth/next')
  return getServerSession(authOptions)
}
