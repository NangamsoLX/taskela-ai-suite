import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Shield, Info } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { TOOLS } from "@/lib/tools";
import { BrandMark } from "@/components/brand-mark";

const NAV_ACTIVE =
  "data-[active=true]:bg-white/[0.04] data-[active=true]:text-foreground data-[active=true]:shadow-[inset_2px_0_0_0_var(--nav-accent,var(--accent))]";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (p: string) => path === p;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border py-5">
        <Link to="/" className="flex items-center justify-center">
          {collapsed ? (
            <span
              className="text-xl font-semibold bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #A78BFA, #C4B5FD)", fontFamily: '"Space Grotesk", sans-serif' }}
            >
              T
            </span>
          ) : (
            <BrandMark size="sm" tagline />
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1 py-3">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Overview</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")} className={NAV_ACTIVE}>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>AI Tools</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <SidebarMenuItem key={t.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(t.to)}
                      className={NAV_ACTIVE}
                      style={{ ["--nav-accent" as string]: t.colorVar } as React.CSSProperties}
                    >
                      <Link to={t.to}>
                        <Icon className="h-4 w-4" style={{ color: isActive(t.to) ? t.colorVar : undefined }} />
                        <span>{t.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>About</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/responsible-ai")} className={NAV_ACTIVE}>
                  <Link to="/responsible-ai">
                    <Shield className="h-4 w-4" />
                    <span>Responsible AI</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/about")} className={NAV_ACTIVE}>
                  <Link to="/about">
                    <Info className="h-4 w-4" />
                    <span>About</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && (
          <p className="px-2 py-2 text-[10px] text-muted-foreground">
            © Taskela AI
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
