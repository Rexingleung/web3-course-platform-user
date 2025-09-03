import { create } from 'zustand';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/constants';
import { ContractStore, Course } from '../types';
import { parseEther } from '../utils/format';

const useContractStore = create<ContractStore>((set, get) => ({
  contract: null,
  isLoading: false,
  error: null,

  initializeContract: async () => {
    if (!window.ethereum) {
      const error = '请安装 MetaMask 钱包';
      set({ error });
      toast.error(error);
      return;
    }

    try {
      set({ isLoading: true, error: null });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      set({ contract, isLoading: false });
      console.log('合约初始化成功');
    } catch (error: any) {
      const errorMsg = '合约初始化失败';
      console.error('合约初始化失败:', error);
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
    }
  },

  purchaseCourse: async (courseId: number) => {
    const { contract } = get();
    
    if (!contract) {
      await get().initializeContract();
    }

    try {
      set({ isLoading: true, error: null });
      
      // 这里需要根据实际合约接口调整
      // 假设合约有一个 purchaseCourse 方法，需要传入课程ID和价格
      const tx = await contract.purchaseCourse(courseId, { 
        value: ethers.parseEther("0.01") // 示例价格，实际应该从课程信息获取
      });
      
      toast.loading('购买课程中...', { id: 'purchase-course' });
      
      const receipt = await tx.wait();
      
      set({ isLoading: false });
      toast.success('课程购买成功！', { id: 'purchase-course' });
      
      return {
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed?.toString()
      };
    } catch (error: any) {
      const errorMsg = error.reason || error.message || '购买课程失败';
      console.error('购买课程失败:', error);
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg, { id: 'purchase-course' });
      throw error;
    }
  },

  getPurchasedCourses: async (): Promise<Course[]> => {
    const { contract } = get();
    
    if (!contract) {
      await get().initializeContract();
    }

    try {
      set({ isLoading: true, error: null });
      
      // 这里需要根据实际合约接口调整
      // 假设合约有一个方法可以获取用户购买的课程
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        throw new Error('请先连接钱包');
      }
      
      const userAddress = accounts[0];
      const purchasedCourseIds = await contract.getUserPurchasedCourses(userAddress);
      
      // 获取每个课程的详细信息
      const courses: Course[] = [];
      for (const courseId of purchasedCourseIds) {
        try {
          const courseData = await contract.getCourse(courseId);
          courses.push({
            id: Number(courseId),
            title: courseData[0],
            description: courseData[1],
            instructor: courseData[2],
            price: ethers.formatEther(courseData[3]),
            duration: '待定', // 如果合约中没有这个字段
            difficulty: 'Intermediate' as const,
            rating: 4.5, // 默认值
            studentsCount: 0, // 默认值
            image: '/placeholder-course.jpg', // 默认图片
            category: '区块链', // 默认分类
            isPurchased: true,
          });
        } catch (error) {
          console.error(`获取课程 ${courseId} 信息失败:`, error);
        }
      }
      
      set({ isLoading: false });
      return courses;
    } catch (error: any) {
      const errorMsg = error.message || '获取购买的课程失败';
      console.error('获取购买的课程失败:', error);
      set({ error: errorMsg, isLoading: false });
      return [];
    }
  },
}));

export default useContractStore;
