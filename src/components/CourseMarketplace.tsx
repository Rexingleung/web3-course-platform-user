import { useState, useEffect } from 'react';
import { ShoppingCart, BookOpen, DollarSign, Calendar, User, RefreshCw, Check } from 'lucide-react';
import useWalletStore from '../stores/walletStore';
import useContractStore from '../stores/contractStore';
import { apiService } from '../services/api';
import { Course } from '../types';
import { formatEther, formatDate, formatAddress } from '../utils/format';
import toast from 'react-hot-toast';

export function CourseMarketplace() {
  const { account, isConnected, updateBalance } = useWalletStore();
  const { purchaseCourse, hasUserPurchasedCourse } = useContractStore();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchasedCourses, setPurchasedCourses] = useState<Set<number>>(new Set());
  const [purchasingCourses, setPurchasingCourses] = useState<Set<number>>(new Set());

  const loadCourses = async () => {
    setLoading(true);
    try {
      const allCourses = await apiService.getCourses();
      setCourses(allCourses);
      
      // Check purchase status for each course
      if (account && isConnected) {
        const purchasedSet = new Set<number>();
        for (const course of allCourses) {
          try {
            const hasPurchased = await hasUserPurchasedCourse(course.courseId, account);
            if (hasPurchased) {
              purchasedSet.add(course.courseId);
            }
          } catch (error) {
            console.error('Failed to check purchase status for course', course.courseId);
          }
        }
        setPurchasedCourses(purchasedSet);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
      toast.error('加载课程失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (course: Course) => {
    if (!account || !isConnected) {
      toast.error('请先连接钱包');
      return;
    }

    if (purchasedCourses.has(course.courseId)) {
      toast.error('你已经购买了这门课程');
      return;
    }

    setPurchasingCourses(prev => new Set([...prev, course.courseId]));
    
    try {
      const result = await purchaseCourse(course.courseId, formatEther(course.price));
      
      // Record purchase in backend
      await apiService.recordPurchase({
        courseId: course.courseId,
        buyer: account,
        transactionHash: result.transactionHash,
        price: course.price
      });
      
      // Update purchased courses
      setPurchasedCourses(prev => new Set([...prev, course.courseId]));
      
      // Update wallet balance
      updateBalance();
      
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setPurchasingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(course.courseId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    loadCourses();
  }, [account, isConnected]);

  if (!isConnected) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center">
        <ShoppingCart className="mx-auto mb-4 text-white opacity-50" size={64} />
        <h2 className="text-2xl font-bold text-white mb-2">课程市场</h2>
        <p className="text-white opacity-70">
          请先连接你的钱包以浏览和购买课程
        </p>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <ShoppingCart className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">课程市场</h2>
            <p className="text-white opacity-70">发现并购买优质课程</p>
          </div>
        </div>
        
        <button
          onClick={loadCourses}
          disabled={loading}
          className="glass-effect rounded-lg px-4 py-2 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={16} />
          <span>刷新</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="animate-spin text-white mr-2" size={24} />
          <span className="text-white">加载中...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto mb-4 text-white opacity-30" size={64} />
          <h3 className="text-xl font-semibold text-white mb-2">暂无课程</h3>
          <p className="text-white opacity-70 mb-4">
            等待作者发布更多精彩课程
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isPurchased = purchasedCourses.has(course.courseId);
            const isPurchasing = purchasingCourses.has(course.courseId);
            const isOwnCourse = account?.toLowerCase() === course.author.toLowerCase();
            
            return (
              <div
                key={course.courseId}
                className="glass-effect rounded-xl p-6 hover:bg-white hover:bg-opacity-10 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="glass-effect rounded-lg px-3 py-1 ml-4">
                    <span className="text-white text-sm">#{course.courseId}</span>
                  </div>
                </div>

                <p className="text-white opacity-70 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-white opacity-80">
                    <DollarSign size={14} />
                    <span className="text-sm">{formatEther(course.price)} ETH</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-white opacity-80">
                    <Calendar size={14} />
                    <span className="text-sm">{formatDate(course.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-white opacity-80">
                    <User size={14} />
                    <span className="text-sm">{formatAddress(course.author)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white border-opacity-10">
                  {isOwnCourse ? (
                    <div className="glass-effect rounded-lg px-4 py-2 text-center">
                      <span className="text-yellow-400 text-sm">这是你的课程</span>
                    </div>
                  ) : isPurchased ? (
                    <div className="glass-effect rounded-lg px-4 py-2 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Check size={16} className="text-green-400" />
                        <span className="text-green-400 text-sm">已购买</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(course)}
                      disabled={isPurchasing}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPurchasing ? (
                        <RefreshCw className="animate-spin" size={16} />
                      ) : (
                        <ShoppingCart size={16} />
                      )}
                      <span>{isPurchasing ? '购买中...' : '立即购买'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}