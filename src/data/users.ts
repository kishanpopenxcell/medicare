import type { User } from "@/types"

export const demoUsers: User[] = [
  {
    id: "u-patient",
    name: "Ava Thompson",
    email: "patient@demo.com",
    role: "patient",
    patientId: "p-1",
    avatarInitials: "AT",
  },
  {
    id: "u-staff",
    name: "Dr. Jordan Blake",
    email: "staff@demo.com",
    role: "staff",
    avatarInitials: "JB",
  },
]

export function findUserByEmail(email: string): User | undefined {
  return demoUsers.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  )
}
