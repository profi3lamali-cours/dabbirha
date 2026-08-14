// aiService.ts
// خدمة "الذكاء" الحالية تعتمد بالكامل على قواعد محلية (لا حاجة لأي API أو مفتاح).
// هذا الملف مصمم بحيث يمكن ربطه لاحقًا بخدمة AI خارجية دون كسر التطبيق.
//
// لإضافة مزود AI مستقبلًا: نفّذ AIProvider أدناه، ثم استبدل `localRuleBasedProvider`
// في `getAIProvider()`. إن لم يتوفر أي مزود، سيستمر التطبيق بالعمل بالقواعد المحلية.

export interface AIAdviceRequest {
  question: string;
  context?: Record<string, unknown>;
}

export interface AIProvider {
  getAdvice(req: AIAdviceRequest): Promise<string>;
}

const localRuleBasedProvider: AIProvider = {
  async getAdvice({ question }) {
    // نظام قواعد بسيط بدل استدعاء API خارجي - يمكن تحسينه بمزيد من القواعد
    if (question.includes('توفير')) {
      return 'راجع صفحة "ساعدني على التوفير" لخطة مخصصة بناءً على مصاريفك الحالية.';
    }
    return 'لا يتوفر مزود ذكاء اصطناعي خارجي حاليًا؛ يعمل التطبيق بقواعد محلية ذكية بدون الحاجة إلى إنترنت.';
  },
};

let activeProvider: AIProvider = localRuleBasedProvider;

export function getAIProvider(): AIProvider {
  return activeProvider;
}

/** لتفعيل مزود AI خارجي مستقبلًا: */
export function setAIProvider(provider: AIProvider) {
  activeProvider = provider;
}
