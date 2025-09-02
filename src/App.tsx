import { useState } from 'react'
import { WalletProvider } from './components/WalletProvider'
import { Header } from './components/Header'
import { CourseMarketplace } from './components/CourseMarketplace'
import { PurchasedCourses } from './components/PurchasedCourses'
import { ShoppingCart, ShoppingBag } from 'lucide-react'

type Tab = 'marketplace' | 'purchased'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('marketplace')

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="glass-effect rounded-xl p-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === 'marketplace'
                      ? 'bg-white bg-opacity-20 text-white shadow-lg'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <ShoppingCart size={20} />
                  课程市场
                </button>
                <button
                  onClick={() => setActiveTab('purchased')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === 'purchased'
                      ? 'bg-white bg-opacity-20 text-white shadow-lg'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <ShoppingBag size={20} />
                  已购课程
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === 'marketplace' && <CourseMarketplace />}
            {activeTab === 'purchased' && <PurchasedCourses />}
          </div>
        </div>
      </div>
    </WalletProvider>
  )
}

export default App
