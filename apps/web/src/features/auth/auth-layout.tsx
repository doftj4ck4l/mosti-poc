
type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <img
            src='/images/mosti-logo.jpg'
            alt='MOSTI'
            className='me-2 size-9 rounded-lg bg-white object-contain ring-1 ring-border'
          />
          <h1 className='text-xl font-medium'>MASTIC Intelligence</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
