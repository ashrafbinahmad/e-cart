import * as React from "react";

import { cn } from "@/lib/utils";

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex rounded-sm py-2 pl-2 hover:bg-card text-card-foreground cursor-pointer hover:shadow-sm",
      className
    )}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuItemIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "",
      className
    )}
    {...props}
  />
));
SidebarMenuItemIcon.displayName = "SidebarMenuItemIcon";

const SidebarMenuItemText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "ml-3",
      className
    )}
    {...props}
  />
));
SidebarMenuItemText.displayName = "SidebarMenuItemText";

export { SidebarMenuItem, SidebarMenuItemIcon, SidebarMenuItemText };
