
import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={cn(
        "fixed bottom-8 right-8 z-50 rounded-full shadow-lg transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 pointer-events-none"
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  )
}
</DropdownMenuContent>
```

Now I'll create a breadcrumb component for better navigation:

<lov-write file_path="src/components/navigation/Breadcrumb.tsx">
import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
}

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/products': 'Products',
  '/auth': 'Authentication',
  '/list-product': 'List Product',
  '/seller-dashboard': 'Seller Dashboard',
  '/admin': 'Admin Panel',
  '/help-center': 'Help Center',
  '/safety-tips': 'Safety Tips',
  '/terms-of-service': 'Terms of Service',
  '/privacy-policy': 'Privacy Policy',
  '/contact-us': 'Contact Us'
}

export const Breadcrumb = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...pathnames.map((pathname, index) => {
      const href = `/${pathnames.slice(0, index + 1).join('/')}`
      const label = routeLabels[href] || pathname.charAt(0).toUpperCase() + pathname.slice(1)
      return { label, href }
    })
  ]

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground py-4">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.href}>
          {index === 0 && <Home className="h-4 w-4" />}
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">{breadcrumb.label}</span>
          ) : (
            <Link
              to={breadcrumb.href}
              className="hover:text-foreground transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
