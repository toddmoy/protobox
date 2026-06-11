import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router'
import { DesignSystemProvider } from '@zapier/design-system'

const ZinniaLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<'a'> & { href?: string }
>(function ZinniaLink({ href = '', ...props }, ref) {
  return <RouterLink ref={ref} to={href} {...props} />
})

export function ZinniaProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <DesignSystemProvider LinkComponent={ZinniaLink} navigate={navigate}>
      {children}
    </DesignSystemProvider>
  )
}
