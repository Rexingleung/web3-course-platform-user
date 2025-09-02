import { useState, useEffect } from 'react';
import { ShoppingBag, BookOpen, DollarSign, Calendar, RefreshCw, Play } from 'lucide-react';
import useWalletStore from '../stores/walletStore';
import { apiService } from '../services/api';
import { Course } from '../types';
import { formatEther, formatDate } from '../utils/format';
import toast from 'react-hot-toast';

export function PurchasedCourses() {
  const { account, isConnected } = useWalletStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPurchasedCourses = async () => {
    if (!account || !isConnected) return;
    
    setLoading(true);
    try {
      const purchasedCourses = await apiService.getUserPurchasedCourses(account);
      setCourses(purchasedCourses);
    } catch (error) {
      console.error('Failed to load purchased courses:', error);
      toast.error('加载已购课程失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchasedCourses();
  }, [account, isConnected]);

  if (!isConnected) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center">
        <ShoppingBag className="mx-auto mb-4 text-white opacity-50" size={64} />
        <h2 className="text-2xl font-bold text-white mb-2">已购课程</h2>
        <p className="text-white opacity-70">
          请先连接你的钱包以查看已购买的课程
        </p>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">已购课程</h2>
            <p className="text-white opacity-70">你已购买的所有课程</p>
          </div>
        </div>
        
        <button
          onClick={loadPurchasedCourses}
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
          <ShoppingBag className="mx-auto mb-4 text-white opacity-30" size={64} />
          <h3 className="text-xl font-semibold text-white mb-2">还没有购买课程</h3>
          <p className="text-white opacity-70 mb-4">
            去课程市场购买一些感兴趣的课程吧！
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
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
                  <span className="text-sm">购买价格: {formatEther(course.price)} ETH</span>
                </div>
                
                <div className="flex items-center space-x-2 text-white opacity-80">
                  <Calendar size={14} />
                  <span className="text-sm">发布于 {formatDate(course.createdAt)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white border-opacity-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white opacity-70 text-sm">课程状态</span>
                  <div className="glass-effect rounded-full px-3 py-1">
                    <span className="text-green-400 text-sm">已购买</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                  <Play size={16} />
                  <span>开始学习</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}