import { useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='max-w-sm gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Log Masuk</CardTitle>
          <CardDescription>
            Masukkan e-mel dan kata laluan untuk mengakses platform MASTIC Intelligence · MASTIC ·
            MOSTI
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <UserAuthForm redirectTo={redirect} />
          <div className='rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground'>
            <p className='mb-1 font-medium text-foreground'>Akaun demo (POC)</p>
            <p>
              E-mel: <span className='font-mono'>analyst@stemintel.gov.my</span>
            </p>
            <p>
              Kata laluan: <span className='font-mono'>Analyst#123</span>
            </p>
            <p className='mt-1'>Peranan analisis boleh dijalankan tanpa backend pada fasa ini.</p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
