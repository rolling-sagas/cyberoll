const featureCtrl = {
  enablePricing: process.env.NEXT_PUBLIC_OFFLINE_PRICING !== 'true',
};

export { featureCtrl };
