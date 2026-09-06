'use client'

import * as React from 'react'

import { NavMain } from '#/components/nav-main.tsx'
import { NavUser } from '#/components/nav-user.tsx'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar.tsx'
import {
  Settings2Icon,
  TerminalIcon,
  FilePenIcon,
  BoxIcon,
  LayoutTemplateIcon,
  FoldersIcon,
} from 'lucide-react'

const data = {
  user: {
    name: 'M. Fakhar Sultan',
    email: 'fakharsultan.dev@gmail.com',
    avatar: 'https://fakhyy.com/profile.png',
  },
  navMain: [
    {
      title: 'Projects',
      url: '#',
      icon: <FoldersIcon />,
      isActive: true,
    },
    {
      title: 'Templates',
      url: '#',
      icon: <LayoutTemplateIcon />,
    },
    {
      title: 'Resources',
      url: '#',
      icon: <BoxIcon />,
    },
    {
      title: 'Blog',
      url: '#',
      icon: <FilePenIcon />,
      items: [
        {
          title: 'Posts',
          url: '#',
        },
        {
          title: 'Topics',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: <Settings2Icon />,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Developer',
          url: '#',
        },
      ],
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
                <img src="https://fakhyy.com/profile.png" alt="profile photo" />
                <TerminalIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Admin</span>
                <span className="truncate text-xs">Ecommerce</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
