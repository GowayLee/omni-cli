/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CountTokensResponse,
  GenerateContentResponse,
  GenerateContentParameters,
  CountTokensParameters,
  EmbedContentResponse,
  EmbedContentParameters,
  GoogleGenAI,
} from '@google/genai';
import { createCodeAssistContentGenerator } from '../code_assist/codeAssist.js';
import { DEFAULT_GEMINI_MODEL } from '../config/models.js';
import { getEffectiveModel } from './modelCheck.js';
import { Config } from '../config/config.js';

/**
 * Interface abstracting the core functionalities for generating content and counting tokens.
 */
export interface ContentGenerator {
  generateContent(
    request: GenerateContentParameters,
  ): Promise<GenerateContentResponse>;

  generateContentStream(
    request: GenerateContentParameters,
  ): Promise<AsyncGenerator<GenerateContentResponse>>;

  countTokens(request: CountTokensParameters): Promise<CountTokensResponse>;

  embedContent(request: EmbedContentParameters): Promise<EmbedContentResponse>;
}

// export enum AuthType {
//   CUSTOM_API = 'custom-api-key',
//   LOGIN_WITH_GOOGLE = 'oauth-personal',
//   USE_GEMINI = 'gemini-api-key',
//   USE_VERTEX_AI = 'vertex-ai',
// }

export type ContentGeneratorConfig = {
  model: string; // api call name of model
  apiKey?: string;
  apiEndpoint?: string;
  // vertexai?: boolean;
  // authType?: AuthType | undefined;
};

export async function createContentGeneratorConfig(
  model: string,
  // authType: AuthType | undefined,
  // config?: { getModel?: () => string },
  config: Config,
): Promise<ContentGeneratorConfig> {
  const activeModel = config.getModelByModelId(model);
  const activeProvider = config.getProviderByModelId(model);

  return {
    model: activeModel.name,
    apiKey: activeProvider.apiKey,
    apiEndpoint: activeProvider.apiBaseUrl,
  };

  // // Fallback to existing logic if no active provider is set
  // const geminiApiKey = process.env.GEMINI_API_KEY;
  // const googleApiKey = process.env.GOOGLE_API_KEY;
  // const googleCloudProject = process.env.GOOGLE_CLOUD_PROJECT;
  // const googleCloudLocation = process.env.GOOGLE_CLOUD_LOCATION;

  // const effectiveModel = config.getModel() || DEFAULT_GEMINI_MODEL;

  // const contentGeneratorConfig: ContentGeneratorConfig = {
  //   model: effectiveModel,
  //   authType: config.getContentGeneratorConfig()?.authType,
  // };

  // if (contentGeneratorConfig.authType === AuthType.LOGIN_WITH_GOOGLE) {
  //   return contentGeneratorConfig;
  // }

  // if (contentGeneratorConfig.authType === AuthType.USE_GEMINI && geminiApiKey) {
  //   contentGeneratorConfig.apiKey = geminiApiKey;
  //   contentGeneratorConfig.model = await getEffectiveModel(
  //     contentGeneratorConfig.apiKey,
  //     contentGeneratorConfig.model,
  //   );

  //   return contentGeneratorConfig;
  // }

  // if (
  //   contentGeneratorConfig.authType === AuthType.USE_VERTEX_AI &&
  //   !!googleApiKey &&
  //   googleCloudProject &&
  //   googleCloudLocation
  // ) {
  //   contentGeneratorConfig.apiKey = googleApiKey;
  //   contentGeneratorConfig.vertexai = true;
  //   contentGeneratorConfig.model = await getEffectiveModel(
  //     contentGeneratorConfig.apiKey,
  //     contentGeneratorConfig.model,
  //   );

  //   return contentGeneratorConfig;
  // }

  // return contentGeneratorConfig;
}

export async function createContentGenerator(
  config: ContentGeneratorConfig,
): Promise<ContentGenerator> {
  const version = process.env.CLI_VERSION || process.version;
  const httpOptions = {
    headers: {
      'User-Agent': `GeminiCLI/${version} (${process.platform}; ${process.arch})`,
    },
  };

  // FIXME: we need to implement a similar CodeAssistant generation function

  return createCodeAssistContentGenerator(httpOptions);

  // if (config.authType === AuthType.LOGIN_WITH_GOOGLE) {
  //   return createCodeAssistContentGenerator(httpOptions, config.authType);
  // }

  // The following original code import googleGenAI which provider object
  // `models` with functions defined in the interface `ContentGenerator`

  // if (config.authType === AuthType.CUSTOM_API) {
  //   const googleGenAI = new GoogleGenAI({
  //     apiKey: config.apiKey === '' ? undefined : config.apiKey,
  //     baseURL: config.apiEndpoint,
  //     httpOptions,
  //   });
  //   return googleGenAI.models;
  // }

  // if (config.authType === AuthType.CUSTOM_API) {
  //   const googleGenAI = new GoogleGenAI({
  //     apiKey: config.apiKey === '' ? undefined : config.apiKey,
  //     baseURL: config.apiEndpoint,
  //     httpOptions,
  //   });

  //   return googleGenAI.models;
  // }

  // if (
  //   config.authType === AuthType.USE_GEMINI ||
  //   config.authType === AuthType.USE_VERTEX_AI
  // ) {
  //   const googleGenAI = new GoogleGenAI({
  //     apiKey: config.apiKey === '' ? undefined : config.apiKey,
  //     vertexai: config.vertexai,
  //     httpOptions,
  //   });

  //   return googleGenAI.models;
  // }

  // throw new Error(
  //   `Error creating contentGenerator: Unsupported authType: ${config.authType}`,
  // );
}
