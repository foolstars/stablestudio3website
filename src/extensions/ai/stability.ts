import {
  AIConfigs,
  AIGenerateParams,
  AIMediaType,
  AIProvider,
  AISong,
  AITaskResult,
  AITaskStatus,
} from './types';

export interface StabilityConfigs extends AIConfigs {
  apiKey: string;
}

export class StabilityProvider implements AIProvider {
  readonly name = 'stability';
  configs: StabilityConfigs;

  private baseUrl = 'https://api.stability.ai';

  constructor(configs: StabilityConfigs) {
    this.configs = configs;
  }

  async generate({
    params,
  }: {
    params: AIGenerateParams;
  }): Promise<AITaskResult> {
    if (params.mediaType !== AIMediaType.MUSIC) {
      throw new Error('Stability provider currently supports music only');
    }

    return this.generateMusic({ params });
  }

  private async generateMusic({
    params,
  }: {
    params: AIGenerateParams;
  }): Promise<AITaskResult> {
    const prompt = this.buildPrompt(params);
    if (!prompt) {
      throw new Error('prompt is required');
    }
    if (!this.configs.apiKey) {
      throw new Error('STABILITY_API_KEY is not configured');
    }

    const form = new FormData();
    form.append('prompt', prompt);
    form.append('output_format', params.options?.output_format || 'mp3');

    if (params.options?.negative_prompt) {
      form.append('negative_prompt', params.options.negative_prompt);
    }

    if (params.options?.duration) {
      form.append('duration', String(params.options.duration));
    }

    const response = await fetch(
      `${this.baseUrl}/v2beta/audio/stable-audio/text-to-audio`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.configs.apiKey}`,
          Accept: 'audio/*',
        },
        body: form,
      }
    );

    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `Stable Audio request failed (${response.status}): ${message}`
      );
    }

    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    const buffer = Buffer.from(await response.arrayBuffer());
    const audioUrl = `data:${contentType};base64,${buffer.toString('base64')}`;
    const now = new Date();
    const title = params.options?.title || 'Stable Audio 3.0';
    const style = params.options?.style || 'generated audio';

    const song: AISong = {
      id: `stability-${now.getTime()}`,
      createTime: now,
      audioUrl,
      imageUrl: '',
      duration: Number(params.options?.duration || 30),
      prompt,
      title,
      tags: style,
      style,
      model: params.model || 'stable-audio-3',
      artist: 'Stable Audio',
    };

    return {
      taskStatus: AITaskStatus.SUCCESS,
      taskId: song.id || `stability-${now.getTime()}`,
      taskInfo: {
        songs: [song],
        status: 'success',
        createTime: now,
      },
      taskResult: {
        contentType,
        model: params.model || 'stable-audio-3',
      },
    };
  }

  async query({ taskId }: { taskId: string }): Promise<AITaskResult> {
    return {
      taskStatus: AITaskStatus.SUCCESS,
      taskId,
      taskInfo: {
        songs: [],
        status: 'success',
      },
    };
  }

  private buildPrompt(params: AIGenerateParams): string {
    if (params.options?.customMode) {
      const parts = [
        params.options.title ? `Title: ${params.options.title}` : '',
        params.options.style ? `Style: ${params.options.style}` : '',
        params.options.instrumental ? 'Instrumental track.' : '',
        params.options.lyrics ? `Lyrics: ${params.options.lyrics}` : '',
      ].filter(Boolean);

      return parts.join('\n');
    }

    return params.prompt || '';
  }
}
