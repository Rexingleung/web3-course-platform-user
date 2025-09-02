import { create } from 'zustand';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/constants';
import { ContractState, Course } from '../types';
import { parseEther } from '../utils/format';

const useContractStore = create<ContractState>((set, get) => ({
  contract: null,
  provider: null,
  signer: null,
  isInitialized: false,

  initializeContract: async () => {
    if (!window.ethereum) {
      toast.error('请安装 MetaMask 钱包');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      set({
        contract,
        provider,
        signer,
        isInitialized: true
      });

      console.log('合约初始化成功');
    } catch (error: any) {
      console.error('合约初始化失败:', error);
      toast.error('合约初始化失败');
    }
  },

  createCourse: async (title: string, description: string, price: string) => {
    // This method is not used in user frontend but kept for interface compatibility
    throw new Error('Users cannot create courses');
  },

  purchaseCourse: async (courseId: number, price: string) => {
    const { contract, isInitialized } = get();
    
    if (!isInitialized || !contract) {
      await get().initializeContract();
    }

    try {
      const priceWei = parseEther(price);
      const tx = await contract.purchaseCourse(courseId, { value: priceWei });
      
      toast.loading('购买课程中...', { id: 'purchase-course' });
      
      const receipt = await tx.wait();
      
      toast.success('课程购买成功！', { id: 'purchase-course' });
      
      return {
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed?.toString()
      };
    } catch (error: any) {
      console.error('购买课程失败:', error);
      toast.error(error.reason || error.message || '购买课程失败', { id: 'purchase-course' });
      throw error;
    }
  },

  getCourse: async (courseId: number): Promise<Course> => {
    const { contract, isInitialized } = get();
    
    if (!isInitialized || !contract) {
      await get().initializeContract();
    }

    try {
      const courseData = await contract.getCourse(courseId);
      
      return {
        courseId,
        title: courseData[0],
        description: courseData[1],
        author: courseData[2],
        price: courseData[3].toString(),
        createdAt: Number(courseData[4])
      };
    } catch (error: any) {
      console.error('获取课程信息失败:', error);
      throw error;
    }
  },

  getUserPurchasedCourses: async (userAddress: string): Promise<number[]> => {
    const { contract, isInitialized } = get();
    
    if (!isInitialized || !contract) {
      await get().initializeContract();
    }

    try {
      const courseIds = await contract.getUserPurchasedCourses(userAddress);
      return courseIds.map((id: any) => Number(id));
    } catch (error: any) {
      console.error('获取用户购买课程失败:', error);
      return [];
    }
  },

  hasUserPurchasedCourse: async (courseId: number, userAddress: string): Promise<boolean> => {
    const { contract, isInitialized } = get();
    
    if (!isInitialized || !contract) {
      await get().initializeContract();
    }

    try {
      return await contract.hasUserPurchasedCourse(courseId, userAddress);
    } catch (error: any) {
      console.error('检查购买状态失败:', error);
      return false;
    }
  },
}));

export default useContractStore;
