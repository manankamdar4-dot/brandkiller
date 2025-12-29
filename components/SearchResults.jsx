export default function SearchResults({ results }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const calculateSavings = (brandPrice, genericPrice) => {
    if (!brandPrice || !genericPrice) return 0;
    return brandPrice - genericPrice;
  };

  const calculateSavingsPercent = (brandPrice, genericPrice) => {
    if (!brandPrice || brandPrice === 0) return 0;
    const savings = calculateSavings(brandPrice, genericPrice);
    return Math.round((savings / brandPrice) * 100);
  };

  return (
    <div className="space-y-4">
      {results.map((result) => {
        const savings = calculateSavings(result.brand_price, result.generic_price);
        const savingsPercent = calculateSavingsPercent(result.brand_price, result.generic_price);
        
        return (
          <div
            key={result.id}
            className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {result.brand_name}
                </h3>
                <p className="text-lg text-gray-700 mb-4">
                  Generic Equivalent: <span className="font-semibold text-green-600">{result.generic_name}</span>
                </p>
                <div className="flex flex-wrap gap-6 text-base mb-4">
                  <div>
                    <span className="text-gray-500">Brand Price: </span>
                    <span className="font-semibold text-gray-900">{formatPrice(result.brand_price || 0)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Generic Price: </span>
                    <span className="font-semibold text-green-600">{formatPrice(result.generic_price || 0)}</span>
                  </div>
                </div>
                {result.buy_link && (
                  <a
                    href={result.buy_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Buy Generic Product →
                  </a>
                )}
              </div>
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6 text-center min-w-[140px]">
                  <div className="text-sm text-gray-600 mb-2 font-medium">You Save</div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {formatPrice(savings)}
                  </div>
                  {savingsPercent > 0 && (
                    <div className="text-sm text-green-700 font-semibold">
                      {savingsPercent}% off
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

