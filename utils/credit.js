export const ALLOT_TYPE = {
    CHAT: 'llm_generate_consume',
    SUBSCRIPTION_DAILY: 'subscription_daily',
    SUBSCRIPTION_MONTHLY: 'subscription_monthly',
    SUBSCRIPTION: 'stripe_subscription',
    GIFT: 'gift',
}

export const PLAN = {
    FREE: 'free',
    STANDARD: 'standard',
    ADVANCED: 'advanced',
}

export const ALLOT_DAILY_CREDITS = {
    [PLAN.FREE]: 30,
    [PLAN.STANDARD]: 60,
    [PLAN.ADVANCED]: 'unlimited',
}

export const ALLOT_MOUTH_CREDITS = {
    [PLAN.STANDARD]: 700,
}

export const COOKIE_LOGIN = {
    LAST_LOGIN: 'last_login',
    DAILY_CHECK: 'daily_check',
    TOKEN: 'token',
    SSO_TOKEN: 'session-token',
  }
  
  export const RESET_REASON = {
      FREE_DAILY_RESET: 'free_daily_reset',
      STANDARD_DAILY_RESET: 'standard_daily_reset',
  }



export const PRICE_PLAN = {
    standard_year: 96,
    advanced_year: 144,
    standard_month: 10,
    advanced_month: 15,
}
// For Normal
// export const PRICE_ID_PLAN = {
//     standard_year: 'price_1QD27dCRpippm4KoVAabl22V',
//     advanced_year:  'price_1QD0FvCRpippm4Ko8CCl0oji',
//     standard_month: "price_1QD2SDCRpippm4KoEYXb4ikR",
//     advanced_month: 'price_1QD2ZHCRpippm4Ko7cXRvSDh',
// }

// For Normal Test
// export const PRICE_ID_PLAN = {
//     standard_year: 'price_1QD3AWCRpippm4Koj0h48g9r',
//     advanced_year:  'price_1QD39DCRpippm4KollPh19rd',
//     standard_month: "price_1QD3BQCRpippm4KoST4IWCgF",
//     advanced_month: 'price_1QD37kCRpippm4KonQsEUW5k',
// }


export const PRICE_ID_PLAN = {
    standard_year: 'price_1QDMfTCRpippm4KoPyTH5kjI',
    advanced_year:  'price_1QDMePCRpippm4Ko3iNtC20R',
    standard_month: "price_1QDMbfCRpippm4Kodx86xDQ5",
    advanced_month: 'price_1QDMdcCRpippm4KoLM6WjxHf',
}

// export const PRODUCT_ID_PLAN = {
//     STANDARD: 'prod_R6ywUDpD2xTlri',
//     ADVANCED: 'prod_R6ywkJghFfwvkS',
// }
