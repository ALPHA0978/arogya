import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  const location = useLocation()
  
  // Hide footer on user dashboard and other authenticated pages
  const hideFooterRoutes = ['/user-dashboard', '/diagnosis', '/chat', '/vitals', '/predictor', '/civic', '/dashboard']
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default Layout