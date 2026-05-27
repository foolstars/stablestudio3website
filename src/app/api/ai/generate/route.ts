import { AIGenerateParams, AITaskStatus } from '@/extensions/ai';
import { getUuid } from '@/shared/lib/hash';
import { respData, respErr } from '@/shared/lib/resp';
import { createAITask, updateAITaskById } from '@/shared/models/ai_task';
import { getRemainingCredits } from '@/shared/models/credit';
import { getUserInfo } from '@/shared/models/user';
import { getAIService } from '@/shared/services/ai';

export async function POST(req: Request) {
  try {
    const {
      mediaType,
      provider,
      model,
      prompt,
      options,
    }: AIGenerateParams & {
      provider?: string;
    } = await req.json();

    if (!mediaType || !provider || !model) {
      return respErr('invalid params');
    }

    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const costCredits = provider === 'test-audio' ? 0 : 10;
    if (costCredits > 0) {
      const remainingCredits = await getRemainingCredits(user.id);
      if (remainingCredits < costCredits) {
        return respErr('insufficient credits');
      }
    }

    const aiService = await getAIService();
    const aiProvider = aiService.getProvider(provider);
    if (!aiProvider) {
      return respErr('invalid ai provider');
    }

    const result = await aiProvider.generate({
      params: {
        mediaType,
        model,
        prompt: prompt || '',
        options,
      },
    });

    if (!result?.taskStatus || !result.taskId) {
      return respErr('generate ai task failed');
    }

    const task = await createAITask({
      id: getUuid(),
      userId: user.id,
      mediaType,
      provider,
      model,
      prompt: prompt || '',
      options: options ? JSON.stringify(options) : null,
      status: result.taskStatus,
      taskId: result.taskId,
      taskInfo: result.taskInfo ? JSON.stringify(result.taskInfo) : null,
      taskResult: result.taskResult ? JSON.stringify(result.taskResult) : null,
      costCredits,
      scene: mediaType,
    });

    if (result.taskStatus === AITaskStatus.FAILED && task.creditId) {
      await updateAITaskById(task.id, {
        status: result.taskStatus,
        creditId: task.creditId,
      });
    }

    return respData({
      id: task.id,
      taskId: task.taskId,
      status: task.status,
      taskInfo: task.taskInfo,
    });
  } catch (e: any) {
    console.log('ai generate failed', e);
    return respErr(e.message);
  }
}
