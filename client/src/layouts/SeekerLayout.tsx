import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function SeekerLayout() {
  return (
    <div className="min-h-screen text-white bg-[#0b0f14]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}



