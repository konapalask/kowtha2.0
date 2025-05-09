import NextAuth, { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from '@/utils/axios';

// Extend the built-in session types
declare module "next-auth" {
  interface User {
    role?: string;
    token?: string;
  }
  interface Session {
    user: {
      role?: string;
      token?: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    token?: string;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'OTP',
      credentials: {
        mobile: { label: "Mobile Number", type: "text" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.mobile || !credentials?.otp) {
            throw new Error('Mobile and OTP are required');
          }

          // Real API call to backend
          const response = await api.post('/auth/otp/verify', {
            mobile: credentials.mobile,
            otp: credentials.otp,
          });

          // Assume backend returns { token, ...user }
          if (response.data && response.data.token) {
            return {
              id: response.data.id || '1',
              name: response.data.name || credentials.mobile,
              email: response.data.email || '',
              role: response.data.role || 'User',
              token: response.data.token,
            };
          }

          throw new Error('Invalid OTP');
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error('Invalid OTP');
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.token) {
        token.token = user.token;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.token = token.token;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
};

export default NextAuth(authOptions); 