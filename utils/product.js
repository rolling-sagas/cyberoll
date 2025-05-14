export const PRODUCT_ID_PLAN = {
    STANDARD: 'prod_R6ywUDpD2xTlri',
    ADVANCED: 'prod_R6ywkJghFfwvkS',
}
export function convertPricesToPlanObject(pricesArray1, pricesArray2) {
    const plan = {};
    console.log('pricesArray1', pricesArray1);
    console.log('pricesArray2', pricesArray2);

    const advancedYear = pricesArray1.find(price => price.recurring === 'year');
    const advancedMonth = pricesArray1.find(price => price.recurring === 'month');
    const standardYear = pricesArray2.find(price => price.recurring === 'year');
    const standardMonth = pricesArray2.find(price => price.recurring === 'month');
    
    if (standardYear) plan['standard_year'] = standardYear.priceId;
    if (advancedYear) plan['advanced_year'] = advancedYear.priceId;
    if (standardMonth) plan['standard_month'] = standardMonth.priceId;
    if (advancedMonth) plan['advanced_month'] = advancedMonth.priceId;

    return plan;
}
