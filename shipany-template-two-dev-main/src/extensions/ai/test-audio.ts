import {
  AIConfigs,
  AIGenerateParams,
  AIMediaType,
  AIProvider,
  AISong,
  AITaskResult,
  AITaskStatus,
} from './types';

export class TestAudioProvider implements AIProvider {
  readonly name = 'test-audio';
  configs: AIConfigs;

  constructor(configs: AIConfigs = {}) {
    this.configs = configs;
  }

  async generate({
    params,
  }: {
    params: AIGenerateParams;
  }): Promise<AITaskResult> {
    if (params.mediaType !== AIMediaType.MUSIC) {
      throw new Error('Test audio provider supports music only');
    }

    const now = new Date();
    const prompt = this.buildPrompt(params);
    const style = params.options?.style || 'test tone, preview';
    const title = params.options?.title || 'Free Test Audio';
    const song: AISong = {
      id: `test-audio-${now.getTime()}`,
      createTime: now,
      audioUrl: this.createWavDataUrl(prompt),
      imageUrl: '',
      duration: 6,
      prompt,
      title,
      tags: style,
      style,
      model: params.model || 'free-test-audio',
      artist: 'Local Test Provider',
    };

    return {
      taskStatus: AITaskStatus.SUCCESS,
      taskId: song.id || `test-audio-${now.getTime()}`,
      taskInfo: {
        songs: [song],
        status: 'success',
        createTime: now,
      },
      taskResult: {
        contentType: 'audio/wav',
        model: song.model,
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
      return [
        params.options.title ? `Title: ${params.options.title}` : '',
        params.options.style ? `Style: ${params.options.style}` : '',
        params.options.instrumental ? 'Instrumental track.' : '',
        params.options.lyrics ? `Lyrics: ${params.options.lyrics}` : '',
      ]
        .filter(Boolean)
        .join('\n');
    }

    return params.prompt || 'Local music generation test';
  }

  private createWavDataUrl(prompt: string): string {
    const sampleRate = 44100;
    const durationSeconds = 6;
    const totalSamples = sampleRate * durationSeconds;
    const channels = 1;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const dataSize = totalSamples * channels * bytesPerSample;
    const buffer = Buffer.alloc(44 + dataSize);

    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(channels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * channels * bytesPerSample, 28);
    buffer.writeUInt16LE(channels * bytesPerSample, 32);
    buffer.writeUInt16LE(bitsPerSample, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);

    const seed = Array.from(prompt).reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0
    );
    const baseFrequency = 220 + (seed % 220);
    const secondFrequency = baseFrequency * 1.5;
    const thirdFrequency = baseFrequency * 2;

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const envelope = Math.min(1, i / (sampleRate * 0.2)) *
        Math.min(1, (totalSamples - i) / (sampleRate * 0.5));
      const vibrato = Math.sin(2 * Math.PI * 5 * t) * 4;
      const sample =
        Math.sin(2 * Math.PI * (baseFrequency + vibrato) * t) * 0.45 +
        Math.sin(2 * Math.PI * secondFrequency * t) * 0.25 +
        Math.sin(2 * Math.PI * thirdFrequency * t) * 0.15;
      const amplitude = Math.max(-1, Math.min(1, sample * envelope * 0.5));

      buffer.writeInt16LE(Math.round(amplitude * 32767), 44 + i * 2);
    }

    return `data:audio/wav;base64,${buffer.toString('base64')}`;
  }
}
