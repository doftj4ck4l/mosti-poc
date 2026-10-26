import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className='flex items-center gap-2.5 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0'>
          <img
            src='/images/mosti-logo.jpg'
            alt='MOSTI'
            className='size-10 shrink-0 rounded-lg bg-white object-contain ring-1 ring-white/20 group-data-[collapsible=icon]:size-9'
          />
          <div className='grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden'>
            <span className='truncate font-semibold'>MASTIC Intelligence</span>
            <span className='truncate text-xs text-muted-foreground'>MOSTI</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
