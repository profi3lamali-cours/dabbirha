// demoData.ts - بيانات تجريبية لتوضيح التطبيق فقط

import type { AppData } from '../types';
import { generateId } from '../utils/storage';
import { currentMonthKey } from '../utils/format';

const month = currentMonthKey();

export function buildDemoData(): AppData {
  return {
    profile: {
      monthlyIncome: 120000,
      householdType: 'أسرة',
      numChildren: 2,
      numMembers: 4,
      housingStatus: 'إيجار',
      rentAmount: 25000,
      hasCar: true,
      carFuel: 6000,
      carMaintenance: 2000,
      carInsurance: 1500,
      onboardingComplete: true,
    },
    expenses: [
      { id: generateId(), amount: 25000, categoryTag: 'إيجار', classification: 'ضروري', date: `${month}-01`, paymentMethod: 'تحويل', isEssential: true, isFixed: true },
      { id: generateId(), amount: 4500, categoryTag: 'كهرباء وغاز', classification: 'ضروري', date: `${month}-03`, paymentMethod: 'نقدًا', isEssential: true, isFixed: true },
      { id: generateId(), amount: 2500, categoryTag: 'إنترنت', classification: 'ضروري', date: `${month}-03`, paymentMethod: 'بطاقة', isEssential: true, isFixed: true },
      { id: generateId(), amount: 12000, categoryTag: 'أكل ومنزل', classification: 'ضروري', date: `${month}-05`, paymentMethod: 'نقدًا', isEssential: true },
      { id: generateId(), amount: 6000, categoryTag: 'وقود السيارة', classification: 'مهم', date: `${month}-06`, paymentMethod: 'نقدًا', isEssential: true, isFixed: true },
      { id: generateId(), amount: 3000, categoryTag: 'مدرسة الأطفال', classification: 'ضروري', date: `${month}-07`, paymentMethod: 'تحويل', isEssential: true },
      { id: generateId(), amount: 8000, categoryTag: 'مطاعم', classification: 'كمالي', date: `${month}-09`, paymentMethod: 'بطاقة', isEssential: false },
      { id: generateId(), amount: 4500, categoryTag: 'مقاهي', classification: 'كمالي', date: `${month}-10`, paymentMethod: 'نقدًا', isEssential: false },
      { id: generateId(), amount: 2000, categoryTag: 'اشتراك ترفيه', classification: 'كمالي', date: `${month}-01`, paymentMethod: 'بطاقة', isEssential: false, isFixed: true },
      { id: generateId(), amount: 6000, categoryTag: 'ملابس', classification: 'قابل_للتقليل', date: `${month}-12`, paymentMethod: 'نقدًا', isEssential: false },
      { id: generateId(), amount: 5000, categoryTag: 'تسوق غير مخطط', classification: 'قابل_للتقليل', date: `${month}-14`, paymentMethod: 'بطاقة', isEssential: false },
    ],
    annualExpenses: [
      { id: generateId(), name: 'تأمين السيارة', yearlyAmount: 24000, monthDue: 3 },
      { id: generateId(), name: 'الدخول المدرسي', yearlyAmount: 18000, monthDue: 9 },
      { id: generateId(), name: 'رمضان والعيد', yearlyAmount: 30000, monthDue: 3 },
    ],
    seasonalEvents: [
      { id: generateId(), name: 'رمضان', expectedAmount: 20000, month: 3 },
      { id: generateId(), name: 'الدخول المدرسي', expectedAmount: 18000, month: 9 },
    ],
    goals: [
      { id: generateId(), name: 'هاتف جديد', targetAmount: 60000, savedAmount: 20000, createdAt: new Date().toISOString(), monthlyContribution: 10000 },
      { id: generateId(), name: 'صندوق الطوارئ العائلي', targetAmount: 100000, savedAmount: 35000, createdAt: new Date().toISOString() },
    ],
    emergencyFund: { target: 100000, saved: 35000 },
    isDemoMode: true,
    theme: 'light',
    facebookUrl: '',
  };
}
