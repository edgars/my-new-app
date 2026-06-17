import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { navItems } from '@/lib/nav'

export default function Home() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
      <p className="mt-2 text-muted-foreground">
        Modernized from a legacy system by RNC. Pick an entity to get started.
      </p>

      {navItems.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No entities were generated.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <Card className="transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <DynamicIcon name={item.icon as IconName} className="h-4 w-4 text-primary" />
                      {item.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </CardTitle>
                  <CardDescription>Manage {item.label.toLowerCase()}.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.href}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
