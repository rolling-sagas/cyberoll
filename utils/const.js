export const SSO_HOST = process.env.NEXT_PUBLIC_SSO_HOST

export const SSO_TOKEN_KEY = 'session-token'

export const COMPONENT_TYPE = {
  Toml: 'toml',
  Image: 'img',
  Object: 'obj',
  Number: 'num',
  String: 'str',
  Function: 'func',
}

export const IMAGE_HOST = 'https://imagedelivery.net/8VoaBhaig6kffmvxoWxkaw/'

export const DEFAULT_STORY_IMAGE = 'https://placehold.co/600x400?text=Image+Not+Found'

export const API_PAYURL = process.env.NEXT_PUBLIC_API_PAYURL

export const AI_BASE_URL = 'https://dev-api.rollingsagas.com/seecreet/';
export const PAYPAL_SDK_URL = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription&components=buttons`

export const MESSAGE_STATUS = {
  generating: 'generating',
  finished: 'finished',
  error: 'error',
  outOfCredits: 'outOfCredits',
}

const paypalPlans = (process.env.NEXT_PUBLIC_PAYPAL_PLANS || '').split(' ');
export const PAYPAL_PLANS = {
  month: {
    stardard: paypalPlans[0],
    advanced: paypalPlans[1],
  },
  year: {
    stardard: paypalPlans[2],
    advanced: paypalPlans[3],
  },
}

export const DEFAULT_TDK = {
  title: 'Roll your fate in AI-powered text adventures | Rollingsagas',
  keywords: ['Rollingsagas', 'dice', 'AI-powered', 'creators'],
  description:
    'Play and create AI-powered text adventures with classic dice rolls. Discover imaginative stories with a community of creators',
}
