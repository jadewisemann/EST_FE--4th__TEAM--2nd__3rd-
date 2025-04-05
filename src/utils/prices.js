export const convertPriceToNumber = price => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  return parseInt(price.replace(/,/g, ''), 10);
};

export const sortPrices = (price, priceFinal) => {
  const numericPrice = convertPriceToNumber(price);
  const numericPriceFinal = priceFinal ? convertPriceToNumber(priceFinal) : '';

  return numericPrice
    && numericPriceFinal !== ''
    && numericPriceFinal > numericPrice
    ? [numericPriceFinal, numericPrice]
    : [numericPrice, numericPriceFinal];
};

export const convertPriceFields = item => {
  if (!item) return null;

  const convertedItem = { ...item };

  if ('price' in convertedItem) {
    const [price, priceFinal] = sortPrices(
      convertedItem.price,
      convertedItem.price_final,
    );

    convertedItem.price = price;
    convertedItem.price_final = priceFinal;
  }

  return convertedItem;
};
